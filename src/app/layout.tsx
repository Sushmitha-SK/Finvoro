import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Manrope, } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800",],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  applicationName: "Finvoro",
  title: {
    default: "Finvoro | Personal Finance Management",
    template: "%s | Finvoro",
  },
  description:
    "Manage your personal finances with Finvoro. Track expenses, understand your spending, and work toward your financial goals.",
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
  openGraph: {
    type: "website",
    siteName: "Finvoro",
    title: "Finvoro | Personal Finance Management",
    description:
      "Track expenses, manage your money, and work toward your financial goals with Finvoro.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finvoro | Personal Finance Management",
    description:
      "Track expenses, manage your money, and work toward your financial goals.",
    images: ["/og-image.png"],
  },

};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={` ${geistMono.variable} ${manrope.variable} ${inter.variable} h-full antialiased`}
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