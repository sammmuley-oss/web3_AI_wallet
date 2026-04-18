import type { Metadata } from "next";
import "./globals.css";
import Web3Provider from "@/providers/Web3Provider";

export const metadata: Metadata = {
  title: "ShieldAI — Wallet Guardian | AI-Powered Transaction Security",
  description: "AI-powered assistant that helps you understand crypto transactions, assess risks, and make safe decisions before signing. Protect your wallet from scams, unlimited approvals, and malicious contracts.",
  keywords: ["crypto wallet", "transaction security", "blockchain", "AI assistant", "DeFi safety", "Web3 security"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
