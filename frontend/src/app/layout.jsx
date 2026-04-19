import localFont from 'next/font/local';
import "./globals.css";
import Web3Provider from "@/providers/Web3Provider";

const spaceGrotesk = localFont({
  src: '../../public/fonts/space-grotesk.woff2',
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = localFont({
  src: '../../public/fonts/inter.woff2',
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: '../../public/fonts/jetbrains-mono.woff2',
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: "ShieldAI — Wallet Guardian | AI-Powered Transaction Security",
  description: "AI-powered assistant that helps you understand crypto transactions, assess risks, and make safe decisions before signing. Protect your wallet from scams, unlimited approvals, and malicious contracts.",
  keywords: ["crypto wallet", "transaction security", "blockchain", "AI assistant", "DeFi safety", "Web3 security"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
