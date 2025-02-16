"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";

const inter = Inter({
  variable: "--font-inter",
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
        className={`${isClient ? `${inter.variable} antialiased` : ""}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}




