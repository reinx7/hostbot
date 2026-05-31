import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage(){
  return <main className="grid min-h-screen place-items-center px-5"><Card className="w-full max-w-md p-8"><h1 className="text-3xl font-bold">Entrar na HostBot</h1><p className="mt-2 text-sm text-white/60">Use Discord, Google ou Magic Link.</p><div className="mt-8 grid gap-3"><form action={async()=>{"use server"; await signIn("discord", { redirectTo: "/dashboard" });}}><Button className="w-full" type="submit">Continuar com Discord</Button></form><form action={async()=>{"use server"; await signIn("google", { redirectTo: "/dashboard" });}}><Button className="w-full" variant="secondary" type="submit">Continuar com Google</Button></form><form action={async(formData)=>{"use server"; await signIn("nodemailer", { email: String(formData.get("email")), redirectTo: "/dashboard" });}} className="space-y-3"><Input name="email" type="email" placeholder="voce@email.com"/><Button className="w-full" variant="secondary" type="submit">Receber Magic Link</Button></form></div></Card></main>
}
