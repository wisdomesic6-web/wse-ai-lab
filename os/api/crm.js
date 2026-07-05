const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/crm.js");
module.exports = adapt(handler);
