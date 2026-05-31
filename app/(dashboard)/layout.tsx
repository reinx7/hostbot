import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
export default async function DashboardLayout({children}:{children:React.ReactNode}){ const session=await auth(); if(!session?.user) redirect('/login'); return <div className="min-h-screen md:grid md:grid-cols-[280px_1fr]"><Sidebar/><main className="px-5 py-6 md:px-8">{children}</main></div> }
