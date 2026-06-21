import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Navigation from "@/components/Navigation";

import Particles from "@/components/Particles";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A Love Story",
  description: "A cinematic journey through the hidden layers of our reality. Discover what lies beyond the twilight.",
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '',
  },
};

// Controls viewport — disables iOS auto-zoom on form focus while
// still allowing pinch-zoom for accessibility
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark no-scrollbar" style={{ colorScheme: "dark" }}>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-white/30 tracking-tight`}>
        <LoadingScreen />
        <SmoothScrolling>
          <Particles />
          <Navigation />
          <main className="relative flex flex-col min-h-screen w-full max-w-[1920px] mx-auto overflow-hidden">
            {children}
          </main>
        </SmoothScrolling>
      </body>
    </html>
  );
}
