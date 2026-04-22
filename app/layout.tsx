// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Assemble store DX",
  description: "Vintage T-shirts & Archives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-white text-gray-900 antialiased flex flex-col min-h-screen`}>
        
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-6 md:px-12">
            
            {/* ▼ 魔法1：ロゴのサイズ調整
                スマホ: text-xl (小さめでスタイリッシュに)
                PC: md:text-3xl (元のサイズでゆったりと) */}
            <Link href="/store" className="text-xl md:text-3xl font-normal tracking-widest text-black hover:opacity-70 transition">
              assemble store
            </Link>
            
            {/* ▼ 魔法2：メニューのサイズと隙間の調整
                スマホ: text-xs (文字小さめ), gap-4 (隙間狭め)
                PC: md:text-sm, md:gap-8 (元のゆったりサイズ) */}
            <nav className="flex gap-4 md:gap-8 text-xs md:text-sm tracking-widest font-light">
              <Link href="/store" className="hover:text-gray-400 transition">HOME</Link>
              <Link href="/about" className="hover:text-gray-400 transition">ABOUT</Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        {/* ▼ バグ修正：bg-gray はTailwindに存在しないため効いていませんでした！
            真っ黒なら bg-black、少し薄い黒なら bg-gray-900 などを指定します。
            （今回はハイエンド感を出すため、極限まで薄いグレー bg-gray-50 にし、文字もグレーにしてみました） */}
        <footer className="bg-gray-50 text-gray-400 p-8 text-center mt-auto border-t border-gray-100">
          <p className="tracking-widest text-[10px] md:text-xs font-light">
            © {new Date().getFullYear()} assemble store. All rights reserved.
          </p>
        </footer>

      </body>
    </html>
  );
}