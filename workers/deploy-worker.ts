import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { analyzeProject } from "@/services/project-analyzer";
import { dockerManager } from "@/services/docker-manager";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);

async function unzip(zip: string, dest: string) { await fs.mkdir(dest,{recursive:true}); await exec("unzip", ["-q", zip, "-d", dest]); }

new Worker("deploy", async job => {
  const { botId, deploymentId, artifactPath } = job.data as { botId:string; deploymentId:string; artifactPath:string };
  const runtimeDir = path.resolve(process.env.BOT_RUNTIME_DIR ?? "./storage/runtime", botId);
  await prisma.deployment.update({ where:{id:deploymentId}, data:{status:"BUILDING", startedAt:new Date()} });
  await fs.rm(runtimeDir,{recursive:true,force:true});
  await unzip(artifactPath, runtimeDir);
  const analysis = await analyzeProject(runtimeDir);
  await prisma.bot.update({ where:{id:botId}, data:{language:analysis.language, entrypoint:analysis.entrypoint, status:"DEPLOYING", config:{upsert:{create:{installCommand:analysis.installCommand,startCommand:analysis.startCommand,dockerfilePath:analysis.dockerfilePath}, update:{installCommand:analysis.installCommand,startCommand:analysis.startCommand,dockerfilePath:analysis.dockerfilePath}}}} });
  // Production path: build per-language image. Starter path: use secure base image and mounted source.
  const image = analysis.language === "PYTHON" ? "python:3.12-slim" : analysis.language === "NODEJS" ? "node:22-alpine" : "debian:stable-slim";
  const bot = await prisma.bot.findUniqueOrThrow({ where:{id:botId}, include:{env:true,config:true} });
  const env = Object.fromEntries(bot.env.map(e=>[e.key,e.value]));
  const command = bot.config?.startCommand ? ["sh","-lc", `${bot.config.installCommand ?? "true"} && ${bot.config.startCommand}`] : ["sh","-lc","sleep infinity"];
  await dockerManager.createBotContainer({ botId, image, env, memoryMb: bot.memoryMb, cpuLimit: bot.cpuLimit, command });
  await prisma.deployment.update({ where:{id:deploymentId}, data:{status:"SUCCESS", finishedAt:new Date()} });
}, { connection: redis, concurrency: 3 });

console.log("deploy-worker online");
