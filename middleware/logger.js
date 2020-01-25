/**
 * - `logger` logs to the console the following information about each request: request method, request url, and a timestamp
 * - this middleware runs on every request made to the API
*/
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

module.exports = logger;
