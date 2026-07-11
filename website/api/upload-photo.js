/* Vercel-only serverless function — receives a base64 image from
   admin-photo.html, checks the shared admin secret, and stores it in
   Vercel Blob at a fixed pathname so the public URL never changes.
   Requires env vars on the Vercel project:
     ADMIN_UPLOAD_SECRET   — password gate for admin-photo.html
     BLOB_READ_WRITE_TOKEN — added automatically once a Blob store is
                             connected to this project */
const { put } = require('@vercel/blob');
const crypto = require('crypto');

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
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

  const body = req.body || {};
  const { secret, contentType, dataBase64 } = body;

  if (!secret || !safeEqual(secret, configuredSecret)) {
    res.status(401).json({ error: 'Wrong password.' });
    return;
  }
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
