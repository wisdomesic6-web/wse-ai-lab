/* Vercel-only serverless function — receives a base64 image from
   admin-photo.html, checks the shared admin secret, and stores it in
   Vercel Blob at a fixed pathname so the public URL never changes.
   Requires env vars on the Vercel project:
     ADMIN_UPLOAD_SECRET   — password gate for admin-photo.html
     BLOB_READ_WRITE_TOKEN — added automatically once a Blob store is
                             connected to this project */
const { put, list } = require('@vercel/blob');
const crypto = require('crypto');

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

// Lightweight brute-force guard on ADMIN_UPLOAD_SECRET, reusing the Blob
// store this endpoint already has (no new service/env var needed). Not a
// distributed lock — a burst of exactly-concurrent requests could slip a
// couple of extra attempts through — but it stops a scripted guesser cold,
// which is the actual threat model for a single-owner upload gate.
const RATE_LIMIT_PATH = 'upload-photo-ratelimit.json';
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function readRateLimitState() {
  try {
    const { blobs } = await list({ prefix: RATE_LIMIT_PATH, limit: 1 });
    if (!blobs.length) return { count: 0, windowStart: Date.now() };
    const res = await fetch(blobs[0].url);
    if (!res.ok) return { count: 0, windowStart: Date.now() };
    return await res.json();
  } catch (err) {
    return { count: 0, windowStart: Date.now() };
  }
}

async function writeRateLimitState(state) {
  try {
    await put(RATE_LIMIT_PATH, JSON.stringify(state), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });
  } catch (err) {
    // Best-effort — a failed write here should not break the request.
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const configuredSecret = process.env.ADMIN_UPLOAD_SECRET;
  if (!configuredSecret) {
    res.status(500).json({ error: 'Upload is not configured yet (missing ADMIN_UPLOAD_SECRET).' });
    return;
  }

  let rateLimitState = await readRateLimitState();
  const now = Date.now();
  if (now - rateLimitState.windowStart > WINDOW_MS) {
    rateLimitState = { count: 0, windowStart: now };
  }
  if (rateLimitState.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((rateLimitState.windowStart + WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', String(retryAfterSec));
    res.status(429).json({ error: 'Too many attempts. Try again later.' });
    return;
  }

  const body = req.body || {};
  const { secret, contentType, dataBase64 } = body;

  if (!secret || !safeEqual(secret, configuredSecret)) {
    rateLimitState.count += 1;
    await writeRateLimitState(rateLimitState);
    res.status(401).json({ error: 'Wrong password.' });
    return;
  }
  // Correct password — clear the counter so normal typos earlier in the
  // window don't count against the founder's next real attempt.
  await writeRateLimitState({ count: 0, windowStart: now });
  if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
    res.status(400).json({ error: 'Only PNG, JPEG, or WebP images are accepted.' });
    return;
  }
  if (!dataBase64) {
    res.status(400).json({ error: 'No file data received.' });
    return;
  }

  const buffer = Buffer.from(dataBase64, 'base64');
  if (buffer.length > MAX_BYTES) {
    res.status(413).json({ error: 'File is too large (5MB max).' });
    return;
  }

  try {
    const blob = await put('founder-photo', buffer, {
      access: 'public',
      contentType: contentType,
      allowOverwrite: true,
    });
    res.status(200).json({ url: blob.url });
  } catch (err) {
    res.status(500).json({ error: String((err && err.message) || err) });
  }
};
