const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/tasks.js");
module.exports = adapt(handler);
