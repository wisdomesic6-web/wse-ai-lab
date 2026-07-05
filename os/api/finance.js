const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/finance.js");
module.exports = adapt(handler);
