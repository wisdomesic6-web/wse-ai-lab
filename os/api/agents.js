const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/agents.js");
module.exports = adapt(handler);
