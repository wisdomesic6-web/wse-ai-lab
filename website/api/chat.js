/* Vercel serverless entrypoint → reuses the Netlify chat handler.
   Requires env var ANTHROPIC_API_KEY on the Vercel project. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/chat.js");
module.exports = adapt(handler);
