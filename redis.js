const redis = require("ioredis");
const { promisify } = require("util");

const client = redis.createClient({
    url: "redis://127.0.0.1:6379",
});

client.set = promisify(client.set);
client.get = promisify(client.get);

module.exports = {
    client,
};
