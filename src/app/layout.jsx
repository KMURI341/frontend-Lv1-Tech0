"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="ja">
      <body
        className={`${isClient ? `${geistSans.variable} ${geistMono.variable} antialiased` : ""}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}



