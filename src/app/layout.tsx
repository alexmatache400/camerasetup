import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { SidebarOffsetProvider } from "@/contexts/SidebarOffsetContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Camera setup",
  description: "Explore new setup ideas for your future projects",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarOffsetProvider>
            <TopBar />
            {children}
            <Footer />
            <CookieConsent />
          </SidebarOffsetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
