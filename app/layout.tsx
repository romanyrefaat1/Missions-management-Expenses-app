import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "./globals.css";

import { SessionProvider } from "@/contexts/session-context";
import { MissionsAllProvider } from "@/contexts/missions-all-context";
import { TooltipProvider } from "@/components/ui/tooltip";

import AppNavbar from "@/components/app-navbar";
import LayoutPadding from "./LayoutPadding";

const siteUrl = "https://missiono.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Missiono — Mission & Expense Management",
    template: "%s | Missiono",
  },

  description:
    "Missiono is a mission and expense management app that helps you plan missions, track expenses, manage progress, and keep everything organized in one place.",

  applicationName: "Missiono",

  keywords: [
    "mission management",
    "expense management",
    "mission tracking",
    "expense tracker",
    "team mission management",
    "business expense tracking",
    "mission planning",
    "Missiono",
  ],

  authors: [
    {
      name: "Missiono",
      url: siteUrl,
    },
  ],

  creator: "Missiono",
  publisher: "Missiono",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "Sai167nQznsV1gUqyWpdBrUPe6QxEf4KWxcfPfkng44",
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Missiono",
    title: "Missiono — Mission & Expense Management",
    description:
      "Missiono is a mission and expense management app that helps you plan missions, track expenses, manage progress, and keep everything organized in one place.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Missiono — Mission & Expense Management",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Missiono — Mission & Expense Management",
    description:
      "Missiono is a mission and expense management app that helps you plan missions, track expenses, manage progress, and keep everything organized in one place.",
    images: ["/opengraph-image.jpg"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const lora = Lora({
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
      <body
        className={`${geistSans.className} ${lora.variable} antialiased bg-background max-w-screen overflow-x-clip`}
      >
        <LayoutPadding>
          <div id="first-div-inside-body" className="w-full min-w-0">
            <SessionProvider>
              <MissionsAllProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <TooltipProvider>
                    <Suspense fallback={<div>Loading</div>}>
                      <AppNavbar />
                    </Suspense>

                    {children}

                    <Toaster />
                  </TooltipProvider>
                </ThemeProvider>
              </MissionsAllProvider>
            </SessionProvider>
          </div>
        </LayoutPadding>
      </body>
    </html>
  );
}
