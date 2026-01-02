import { Providers } from "@/providers";

import "../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/themeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
