import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SessionProvider } from "@/contexts/session-context";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppNavbar from "@/components/app-navbar";
import { MissionsAllProvider } from "@/contexts/missions-all-context";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${fraunces.variable} antialiased bg-background max-w-screen overflow-x-clip`}>
        <div className="px-6 pb-8 sm:px-10 lg:px-16 w-full min-w-0">
          <SessionProvider>
            <MissionsAllProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <Suspense fallback={<div>Loading</div>}><AppNavbar /></Suspense>

                {children}  
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
            </MissionsAllProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
