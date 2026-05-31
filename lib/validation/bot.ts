import { z } from "zod";
export const createBotSchema = z.object({
  name: z.string().min(2).max(48).regex(/^[a-zA-Z0-9 _-]+$/),
  description: z.string().max(240).optional(),
  teamId: z.string().cuid().optional(),
  memoryMb: z.coerce.number().min(128).max(4096).default(512),
  cpuLimit: z.coerce.number().min(0.1).max(4).default(0.5),
});
export const botActionSchema = z.object({ botId: z.string().cuid(), action: z.enum(["start", "stop", "restart", "delete"]) });
