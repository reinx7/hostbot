import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const deployQueue = new Queue("deploy", { connection: redis, defaultJobOptions: { attempts: 4, backoff: { type: "exponential", delay: 5000 }, removeOnComplete: 200, removeOnFail: 500 } });
export const restartQueue = new Queue("restart", { connection: redis, defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 2500 } } });
export const metricsQueue = new Queue("metrics", { connection: redis, defaultJobOptions: { removeOnComplete: 1000, removeOnFail: 1000 } });
