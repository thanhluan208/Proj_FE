import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Providers } from "@/providers";

import { siteConfig } from "@/config/site";

import "../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/themeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <SpeedInsights />
            <main className="font-poppins">{children}</main>
          </Providers>
        </ThemeProvider>
      </NextIntlClientProvider>
      <Toaster />
    </>
  );
}
