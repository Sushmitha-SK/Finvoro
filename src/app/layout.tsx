import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import {  Geist_Mono, Manrope, } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "Finvoro",
    template: "%s | Finvoro",
  },
  description:
    "A smarter way to manage your personal finances, track expenses, and reach your financial goals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={` ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-svh flex flex-col">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}