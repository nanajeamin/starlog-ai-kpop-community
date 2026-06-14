import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";

export const metadata: Metadata = {
  title: "K-Star Spot · 爱豆同款云巡礼",
  description: "发现首尔爱豆同款圣地，生成你的同款打卡照，和同好一起追星",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <PromoBanner />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
