/* Vercel serverless entrypoint → reuses the Netlify affiliate-logout handler. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-logout.js");
module.exports = adapt(handler);
