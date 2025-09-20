import Redis from "ioredis"

const createRedisConnection = () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  })
  
  redis.on("connect", () => {
    console.log("[Redis] Connected successfully")
  })
  
  redis.on("error", (error) => {
    console.error("[Redis] Connection error:", error.message)
  })
  
  return redis
}

export const redisConnection = createRedisConnection()
