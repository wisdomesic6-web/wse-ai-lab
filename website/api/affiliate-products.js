/* Vercel serverless entrypoint → reuses the Netlify affiliate-products handler. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-products.js");
module.exports = adapt(handler);
