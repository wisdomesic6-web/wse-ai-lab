const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/ai.js");
module.exports = adapt(handler);
