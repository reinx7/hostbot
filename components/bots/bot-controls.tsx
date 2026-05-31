"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
async function act(botId:string, action:string){ const r=await fetch('/api/bots/actions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({botId,action})}); if(!r.ok) throw new Error(await r.text()); }
export function BotControls({botId}:{botId:string}){ return <div className="flex flex-wrap gap-2">{['start','stop','restart'].map(a=><Button key={a} variant="secondary" onClick={()=>toast.promise(act(botId,a),{loading:`${a}...`,success:'Ação enviada',error:e=>e.message})}>{a}</Button>)}<Button variant="destructive" onClick={()=>toast.promise(act(botId,'delete'),{loading:'Deletando...',success:'Bot deletado',error:e=>e.message})}>deletar</Button></div> }
