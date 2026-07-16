import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe Starter — From AI Code to Live App in 20 Minutes",
  description: "Stop generating code. Start shipping apps. Vibe Starter sets up your auth, database, and hosting so you can build from anywhere — phone, browser, laptop.",
  keywords: ["AI code", "app deployment", "Next.js", "Vercel", "no-code", "mobile coding"],
  openGraph: {
    title: "Vibe Starter — From AI Code to Live App in 20 Minutes",
    description: "Stop generating code. Start shipping apps. Free and open source.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Starter — From AI Code to Live App in 20 Minutes",
    description: "Stop generating code. Start shipping apps. Free and open source.",
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
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
