import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { restartQueue } from "@/lib/queues";
import { botActionSchema } from "@/lib/validation/bot";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const body = botActionSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json(body.error.flatten(), { status: 422 });
  const bot = await prisma.bot.findFirst({ where: { id: body.data.botId, ownerId: session.user.id, deletedAt: null } });
  if (!bot) return new NextResponse("Not found", { status: 404 });
  if (body.data.action === "delete") {
    await prisma.bot.update({ where: { id: bot.id }, data: { status: "DELETED", deletedAt: new Date() } });
  } else {
    await restartQueue.add(body.data.action, { botId: bot.id, action: body.data.action });
  }
  await prisma.auditLog.create({ data: { userId: session.user.id, botId: bot.id, action: body.data.action === "delete" ? "BOT_DELETE" : body.data.action === "start" ? "BOT_START" : body.data.action === "stop" ? "BOT_STOP" : "BOT_RESTART" } });
  return NextResponse.json({ ok: true });
}
