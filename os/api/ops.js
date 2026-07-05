const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/ops.js");
module.exports = adapt(handler);
