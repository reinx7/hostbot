import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Shield, Terminal, Zap } from "lucide-react";
import { MotionHero } from "@/components/landing/motion-hero";

const features = [
  [Zap, "Deploy instantâneo", "Upload ZIP, detecção automática e fila resiliente com retry inteligente."],
  [Terminal, "Console realtime", "Logs WebSocket com filtros, highlight e reconexão automática."],
  [Shield, "Isolamento seguro", "Containers com limites de CPU/RAM, rede isolada e auditoria completa."],
  [Bot, "Discord-first", "Métricas, status, ping e comandos pensados para bots Discord."],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-3 font-bold"><span className="css-emoji emoji-bot" /> HostBot</Link>
        <div className="hidden items-center gap-6 text-sm text-white/70 md:flex"><a href="#pricing">Planos</a><a href="#faq">FAQ</a><Link href="/docs">Docs</Link></div>
        <Button asChild variant="secondary"><Link href="/login">Entrar</Link></Button>
      </nav>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
        <MotionHero />
        <div className="neon-border glass animate-float rounded-3xl p-4">
          <div className="rounded-2xl border border-white/10 bg-[#080914] p-4 shadow-2xl">
            <div className="mb-4 flex gap-2"><span className="h-3 w-3 rounded-full bg-red-400"/><span className="h-3 w-3 rounded-full bg-yellow-400"/><span className="h-3 w-3 rounded-full bg-green-400"/></div>
            <div className="grid gap-4 md:grid-cols-3">
              {[["CPU","18%"],["RAM","384MB"],["Ping","42ms"]].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><p className="text-sm text-white/50">{a}</p><p className="mt-2 text-2xl font-bold">{b}</p></div>)}
            </div>
            <pre className="mt-4 h-64 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-6 text-emerald-300">{`[hostbot] container started\n[discord] logged in as Atlas#0420\n[commands] synced 21 slash commands\n[health] gateway latency 42ms\n[deploy] release v24 online`}</pre>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-4">
        {features.map(([Icon, title, text]) => <Card key={String(title)} className="p-1"><CardContent className="p-6"><Icon className="mb-5 h-7 w-7 text-primary"/><h3 className="font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text as string}</p></CardContent></Card>)}
      </section>
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20"><h2 className="text-center text-3xl font-bold md:text-5xl">Planos simples para escalar</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{["Starter","Pro","Scale"].map((p,i)=><Card key={p} className={i===1?"neon-border p-6":"p-6"}><h3 className="text-xl font-bold">{p}</h3><p className="mt-4 text-4xl font-black">R${[19,49,149][i]}<span className="text-sm text-white/50">/mês</span></p><ul className="mt-6 space-y-3 text-sm text-white/70"><li><span className="css-emoji emoji-check"/>Bots online 24/7</li><li><span className="css-emoji emoji-check"/>Deploy por ZIP</li><li><span className="css-emoji emoji-check"/>Console realtime</li></ul><Button className="mt-8 w-full">Começar <ArrowRight size={16}/></Button></Card>)}</div></section>
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20"><h2 className="text-3xl font-bold">FAQ</h2>{["Posso hospedar bots Python?","O HostBot usa Docker?","Dá para colaborar em equipe?"].map(q=><details key={q} className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 text-white/60">Sim. A arquitetura suporta multi-linguagem, isolamento por container, times, permissões e auditoria.</p></details>)}</section>
    </main>
  );
}
