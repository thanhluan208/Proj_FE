import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { Providers } from "@/providers";

import { siteConfig } from "@/config/site";

import "../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/themeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { twJoin } from "tailwind-merge";
import { cn } from "@/lib/utils";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
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
  console.log(routing, locale);
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(twJoin(beVietnamPro.variable), "no-scrollbar")}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Providers>
              <SpeedInsights />
              <main className="font-be-vietnam-pro">{children}</main>
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
