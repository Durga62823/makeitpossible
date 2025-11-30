import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | undefined;

const getLimiter = () => {
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
    });
  }

  return limiter;
};

export const checkRateLimit = async (identifier: string) => {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { success: true };
  }

  const result = await getLimiter().limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
};
