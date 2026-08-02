const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliates.js");
module.exports = adapt(handler);
