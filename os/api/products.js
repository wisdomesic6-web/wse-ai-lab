const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/products.js");
module.exports = adapt(handler);
