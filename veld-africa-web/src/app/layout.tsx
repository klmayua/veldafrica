import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { NavDock } from "@/components/shared/NavDock";
import { Chatbot } from "@/components/shared/Chatbot";

export const metadata: Metadata = {
  title: "VELD AFRICA | Gateway to African Real Estate Investment",
  description:
    "VELD AFRICA bridges the gap between ambitious investors and Africa's most promising property opportunities. Invest in premium real estate across Lagos, Abuja, Dubai and beyond.",
  keywords: [
    "African real estate",
    "property investment",
    "Lagos property",
    "Dubai real estate",
    "diaspora investment",
    "agro real estate",
    "luxury homes Nigeria",
    "off-plan property",
  ],
  authors: [{ name: "VELD AFRICA" }],
  openGraph: {
    title: "VELD AFRICA | Gateway to African Real Estate Investment",
    description:
      "Building generational wealth through premium African real estate. From Lagos to Dubai, invest with confidence.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELD AFRICA | Gateway to African Real Estate Investment",
    description:
      "Building generational wealth through premium African real estate.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <NavDock />
        <Chatbot />
      </body>
    </html>
  );
}
