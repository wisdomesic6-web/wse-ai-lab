const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/team.js");
module.exports = adapt(handler);
