import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "antd/dist/reset.css";


export const metadata: Metadata = {
  title: "GOGO CAFE - ระบบสั่งซื้อเครื่องดื่มออนไลน์",
  description:
    "สั่งเครื่องดื่มออนไลน์ ไม่ต้องต่อแถว - ระบบสั่งซื้อและรับเครื่องดื่มอัจฉริยะ",
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
