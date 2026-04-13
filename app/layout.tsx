import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "./context/LanguageContext";
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
  metadataBase: new URL("https://agentnx.ai"),
  title: "AgentNX.ai — AI Voice Agents for Business",
  description: "Deploy custom AI voice agents that handle inbound and outbound calls 24/7. No salaries, no benefits, no sick days. Built for pharma, healthcare, and government contractors.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AgentNX.ai — AI Voice Agents for Business",
    description: "Deploy custom AI voice agents that handle calls 24/7. No salaries, no benefits, no sick days.",
    url: "https://agentnx.ai",
    siteName: "AgentNX.ai",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentNX.ai — AI Voice Agents for Business",
    description: "Deploy custom AI voice agents that handle calls 24/7. No salaries, no benefits, no sick days.",
    site: "@agentnxai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
