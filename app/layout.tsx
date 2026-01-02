import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

import { twJoin } from "tailwind-merge";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
};
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;
  const displayLocale = locale || "en";

  return (
    <html lang={displayLocale} suppressHydrationWarning>
      <body className={twJoin(poppins.variable)}>
        <main className="font-poppins">{children}</main>
      </body>
    </html>
  );
}
