import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound(){ return <main className="grid min-h-screen place-items-center px-5 text-center"><div><span className="css-emoji emoji-warning text-6xl"/><h1 className="mt-6 text-6xl font-black">404</h1><p className="mt-3 text-white/60">Essa rota evaporou no hyperspace.</p><Button asChild className="mt-6"><Link href="/dashboard">Voltar ao dashboard</Link></Button></div></main> }
