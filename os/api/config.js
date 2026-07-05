const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/config.js");
module.exports = adapt(handler);
