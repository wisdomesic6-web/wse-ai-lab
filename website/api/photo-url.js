/* Vercel-only serverless function — public, read-only. Returns the
   current founder-photo URL from Vercel Blob (or null if none has
   been uploaded yet), so the site can show the latest upload without
   a redeploy. Requires BLOB_READ_WRITE_TOKEN on the Vercel project. */
const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(200).json({ url: null });
    return;
  }

  try {
    const { blobs } = await list({ prefix: 'founder-photo', limit: 1 });
    res.status(200).json({ url: blobs.length ? blobs[0].url : null });
  } catch (err) {
    res.status(200).json({ url: null });
  }
};
