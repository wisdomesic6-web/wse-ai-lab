const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/paystack-transactions.js");
module.exports = adapt(handler);
