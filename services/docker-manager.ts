import Docker from "dockerode";
import { prisma } from "@/lib/prisma";

export type CreateContainerInput = { botId: string; image: string; env: Record<string,string>; memoryMb: number; cpuLimit: number; command?: string[] };

export class DockerManager {
  private docker = new Docker(process.env.DOCKER_SOCKET_PATH ? { socketPath: process.env.DOCKER_SOCKET_PATH } : undefined);

  async createBotContainer(input: CreateContainerInput) {
    const name = `hostbot_${input.botId}`;
    await this.removeIfExists(name);
    const container = await this.docker.createContainer({
      name,
      Image: input.image,
      Cmd: input.command,
      Env: Object.entries(input.env).map(([k, v]) => `${k}=${v}`),
      HostConfig: {
        Memory: input.memoryMb * 1024 * 1024,
        CpuQuota: Math.max(10000, Math.floor(input.cpuLimit * 100000)),
        CpuPeriod: 100000,
        PidsLimit: 256,
        AutoRemove: false,
        RestartPolicy: { Name: "unless-stopped" },
        NetworkMode: "hostbot-runtime",
        ReadonlyRootfs: false,
        SecurityOpt: ["no-new-privileges:true"],
        CapDrop: ["ALL"],
      },
      Labels: { "app.hostbot.botId": input.botId, "app.hostbot.managed": "true" },
    });
    await container.start();
    await prisma.bot.update({ where: { id: input.botId }, data: { containerId: container.id, status: "ONLINE" } });
    return container.id;
  }

  async start(botId: string) { const c = await this.getByBot(botId); await c.start(); await prisma.bot.update({ where: { id: botId }, data: { status: "ONLINE" } }); }
  async stop(botId: string) { const c = await this.getByBot(botId); await c.stop({ t: 10 }); await prisma.bot.update({ where: { id: botId }, data: { status: "OFFLINE" } }); }
  async restart(botId: string) { const c = await this.getByBot(botId); await c.restart({ t: 10 }); await prisma.bot.update({ where: { id: botId }, data: { status: "ONLINE" } }); }
  async logs(botId: string) { const c = await this.getByBot(botId); return c.logs({ stdout: true, stderr: true, timestamps: true, tail: 200 }); }

  async stats(botId: string) {
    const c = await this.getByBot(botId);
    const stats = await c.stats({ stream: false });
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const sysDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpu = sysDelta > 0 ? (cpuDelta / sysDelta) * stats.cpu_stats.online_cpus * 100 : 0;
    return { cpu, memoryMb: stats.memory_stats.usage / 1024 / 1024 };
  }

  async cleanupOrphans() {
    const containers = await this.docker.listContainers({ all: true, filters: { label: ["app.hostbot.managed=true"] } as any });
    for (const item of containers) {
      const botId = item.Labels?.["app.hostbot.botId"];
      if (!botId || !(await prisma.bot.findUnique({ where: { id: botId } }))) await this.docker.getContainer(item.Id).remove({ force: true });
    }
  }

  private async getByBot(botId: string) {
    const bot = await prisma.bot.findUniqueOrThrow({ where: { id: botId } });
    if (!bot.containerId) throw new Error("Bot has no container");
    return this.docker.getContainer(bot.containerId);
  }
  private async removeIfExists(name: string) { try { await this.docker.getContainer(name).remove({ force: true }); } catch {} }
}
export const dockerManager = new DockerManager();
