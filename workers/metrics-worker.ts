import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { dockerManager } from "@/services/docker-manager";

new Worker("metrics", async job => {
  const { botId } = job.data as { botId:string };
  const s = await dockerManager.stats(botId);
  await prisma.botMetrics.create({ data: { botId, cpu: s.cpu, memoryMb: s.memoryMb } });
}, { connection: redis, concurrency: 10 });

setInterval(async()=>{
  const bots = await prisma.bot.findMany({ where:{status:"ONLINE", deletedAt:null}, select:{id:true} });
  for (const b of bots) await redis.xadd("hostbot:metrics:tick", "*", "botId", b.id);
}, 15000);
console.log("metrics-worker online");
