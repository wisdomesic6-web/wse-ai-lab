/* Vercel serverless entrypoint → reuses the Netlify affiliate-pick-product handler. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-pick-product.js");
module.exports = adapt(handler);
