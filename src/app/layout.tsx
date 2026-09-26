import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Manrope, Nunito_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunitoSans",
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
      className={`${fontSans.variable} ${geistMono.variable} ${manrope.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LenisProvider>{children}</LenisProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}