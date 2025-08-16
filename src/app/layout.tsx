import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "antd/dist/reset.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "GOGO CAFE - Smart Order System",
  description:
    "สั่งเครื่องดื่มออนไลน์ ไม่ต้องต่อแถว - Smart Café Order & Pickup System",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* <Header /> */}
        {children}
      </body>
    </html>
  );
}
