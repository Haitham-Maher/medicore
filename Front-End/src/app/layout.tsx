import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fontArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-arabic",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ميدي كور - نظام إدارة النقاط الطبية",
  description: "نظام شامل لإدارة النقاط الطبية والأطباء والمرضى",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontArabic.variable} font-sans antialiased`}
      >
        <QueryProvider> {/* انقله إلى هنا */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-left"
              richColors
              dir="rtl"
              expand={true}
              closeButton
              visibleToasts={4}
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: 'var(--font-arabic)',
                  borderRadius: '16px',
                  padding: '16px',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                  border: '1px solid rgba(255,255,255,0.08)',
                },
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>

    </html>
  );
}
