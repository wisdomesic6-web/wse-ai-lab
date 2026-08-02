/* Vercel serverless entrypoint → reuses the Netlify affiliate-dashboard handler. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-dashboard.js");
module.exports = adapt(handler);
