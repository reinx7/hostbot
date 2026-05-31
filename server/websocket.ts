import { WebSocketServer } from "ws";
import { prisma } from "@/lib/prisma";
import { dockerManager } from "@/services/docker-manager";

const wss = new WebSocketServer({ port: Number(process.env.WS_PORT ?? 3001) });
wss.on("connection", async (ws, req) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const botId = url.searchParams.get("botId");
  if (!botId) return ws.close(1008, "Missing botId");
  ws.send(`[hostbot] conectado ao bot ${botId}`);
  const recent = await prisma.botLog.findMany({ where:{botId}, take:100, orderBy:{createdAt:"desc"} });
  recent.reverse().forEach(l=>ws.send(`[${l.level}] ${l.message}`));
  try {
    const stream = await dockerManager.logs(botId);
    stream.on("data", chunk => ws.readyState === ws.OPEN && ws.send(chunk.toString("utf8")));
    ws.on("close", () => stream.destroy());
  } catch (e) { ws.send(`[hostbot] logs indisponíveis: ${(e as Error).message}`); }
});
console.log("websocket server on :3001");
