import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { InstallProvider } from "@/lib/InstallContext";
import FloatingCart from "@/components/FloatingCart";
import { Background } from "@/components/Background";
import { getSession } from "@/lib/session";

const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Scan2Save",
  description: "Next-gen Shopping Experience with QR-based Savings",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Scan2Save",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const userId = session?.userId || null;

  return (
    <html lang="en" className="dark">
      <body
        className={`${bricolage.variable} ${bricolage.className} ${jetbrainsMono.variable} antialiased`}
      >
        <InstallProvider>
          <CartProvider initialUserId={userId}>
            <Background />
            {children}
            <FloatingCart />
          </CartProvider>
        </InstallProvider>
      </body>
    </html>
  );
}

