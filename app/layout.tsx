import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HostBot — Hospedagem de bots Discord",
  description: "Hospedagem poderosa, simples e confiável para seu bot Discord",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://hostbot.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
