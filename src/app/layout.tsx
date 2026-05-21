import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lessa Entregas - Painel",
  description: "Painel de gestão de entregas - Drogarias Lessa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50`}>
        <div className="flex min-h-screen">{children}</div>
      </body>
    </html>
  );
}
