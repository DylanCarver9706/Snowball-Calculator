import type { Metadata } from "next";
import { PostHogProvider } from "./providers/posthog";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snowball Calculator",
  description: "Snowball Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className} suppressHydrationWarning>
            <PostHogProvider>
              <Navbar />
              {children}
              <Toaster position="top-right" />
            </PostHogProvider>
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
