import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CssBaseline } from "@mui/material";
import PostHogProvider from "@/components/PostHogProvider";
import Navbar from "@/components/Navbar";
import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snowball Calculator - Dave Ramsey Debt Payoff Tool",
  description:
    "Calculate your debt payoff strategy using the Dave Ramsey snowball method. Get out of debt faster with our easy-to-use calculator.",
  keywords:
    "debt payoff, snowball method, Dave Ramsey, debt calculator, financial freedom",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeRegistry>
            <CssBaseline />
            <PostHogProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
            </PostHogProvider>
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
