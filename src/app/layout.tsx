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
        <QueryProvider>
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
              closeButton
              theme="system"
              toastOptions={{
                duration: 5000,
                style: {
                  background: 'rgba(var(--background-rgb), 0.8)',
                  backdropFilter: 'blur(12px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
                  fontFamily: 'var(--font-arabic)',
                  padding: '12px 16px',
                },
                className: "border-border/50 bg-background/80 backdrop-blur-xl gap-4",
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>

    </html>
  );
}
