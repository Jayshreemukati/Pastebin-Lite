module.exports = function getNow(req) {
  if (
    process.env.TEST_MODE === "1" &&
    req.headers["x-test-now-ms"]
  ) {
    return new Date(Number(req.headers["x-test-now-ms"]));
  }
  return new Date();
};
