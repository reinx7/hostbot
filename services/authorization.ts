import { prisma } from "@/lib/prisma";
export async function canAccessBot(userId:string, botId:string){ const bot=await prisma.bot.findUnique({where:{id:botId},include:{team:{include:{members:true}}}}); if(!bot||bot.deletedAt) return false; if(bot.ownerId===userId) return true; return !!bot.team?.members.some(m=>m.userId===userId); }
