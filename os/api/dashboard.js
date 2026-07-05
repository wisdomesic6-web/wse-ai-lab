const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/dashboard.js");
module.exports = adapt(handler);
