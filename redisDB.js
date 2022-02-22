const redis = require("redis");

const redisClient = redis.createClient();
redisClient
  .connect()
  .then(() => console.log(`redis connected`))
  .catch((err) => console.log(`redis error: ${err}`));

module.exports = redisClient;
