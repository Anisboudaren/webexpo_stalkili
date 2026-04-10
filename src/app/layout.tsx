import type { Metadata } from "next";
import { FloatingAiAssistant } from "@/components/ui/glowing-ai-chat-assistant";
import { Navbar1 } from "@/components/ui/navbar-1";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workshop MVP",
  description: "Built with Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar1 />
        {children}
        <FloatingAiAssistant />
      </body>
    </html>
  );
}
