import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deployQueue } from "@/lib/queues";
import { createBotSchema } from "@/lib/validation/bot";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return new NextResponse("Missing file", { status: 400 });
  if (!file.name.endsWith(".zip")) return new NextResponse("Only .zip uploads are accepted", { status: 400 });
  if (file.size > Number(process.env.MAX_UPLOAD_MB ?? 150) * 1024 * 1024) return new NextResponse("File too large", { status: 413 });
  const parsed = createBotSchema.safeParse({ name: file.name.replace(/\.zip$/i, "") });
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 422 });
  const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const bot = await prisma.bot.create({ data: { name: parsed.data.name, slug, ownerId: session.user.id, config: { create: {} } } });
  const dir = path.resolve(process.env.BOT_UPLOAD_DIR ?? "./storage/uploads");
  await fs.mkdir(dir, { recursive: true });
  const artifactPath = path.join(dir, `${bot.id}.zip`);
  await fs.writeFile(artifactPath, Buffer.from(await file.arrayBuffer()));
  const deployment = await prisma.deployment.create({ data: { botId: bot.id, artifactKey: artifactPath, status: "QUEUED" } });
  await deployQueue.add("deploy-upload", { botId: bot.id, deploymentId: deployment.id, artifactPath });
  await prisma.auditLog.create({ data: { userId: session.user.id, botId: bot.id, action: "BOT_CREATE" } });
  return NextResponse.json({ botId: bot.id, deploymentId: deployment.id });
}
