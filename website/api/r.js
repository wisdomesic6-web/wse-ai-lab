/* Vercel serverless entrypoint → reuses the Netlify referral redirect handler. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/r.js");
module.exports = adapt(handler);
