"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function MotionHero(){return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}}><div className="inline-flex rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-sm text-white/70"><span className="css-emoji emoji-rocket"/> Cloud premium para bots Discord</div><h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">Hospede bots Discord com uma experiência de outro nível.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">Deploy inteligente, containers isolados, console em tempo real, métricas avançadas e uma interface SaaS moderna para devs que precisam de confiabilidade.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/dashboard">Criar meu bot <ArrowRight size={18}/></Link></Button><Button asChild size="lg" variant="secondary"><Link href="/docs">Ver documentação</Link></Button></div></motion.div>}
