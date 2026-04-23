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
        
        {/* ▼ 魔法のスイッチ（スマホ用メニューの開閉を管理） */}
        <input type="checkbox" id="global-mobile-menu" className="peer hidden" />

        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center p-5 md:px-12">
            
            {/* =========================================
                スマホ専用：左側のハンバーガー（3本線）
            ========================================= */}
            <div className="md:hidden flex items-center">
              <label htmlFor="global-mobile-menu" className="cursor-pointer p-2 -ml-2 flex flex-col gap-[5px]">
                <div className="w-5 h-[1px] bg-black"></div>
                <div className="w-5 h-[1px] bg-black"></div>
                <div className="w-5 h-[1px] bg-black"></div>
              </label>
            </div>

            {/* =========================================
                ロゴ：スマホでは絶対中央、PCでは左寄せ
            ========================================= */}
            <div className="flex-1 text-center md:text-left">
              <Link href="/store" className="text-xl md:text-3xl font-normal tracking-widest text-black hover:opacity-70 transition">
                assemble store
              </Link>
            </div>

            {/* =========================================
                PC専用：右側のナビゲーション
            ========================================= */}
            <nav className="hidden md:flex gap-8 text-sm tracking-widest font-light uppercase items-center">
              <Link href="/" className="hover:text-gray-400 transition">HOME</Link>
              <Link href="/store" className="hover:text-gray-400 transition">STORE</Link>
              <Link href="/about" className="hover:text-gray-400 transition">ABOUT</Link>
            </nav>

            {/* スマホ専用：右側のダミー空間（ロゴを完璧に真ん中に配置するため） */}
            <div className="md:hidden w-9"></div>

          </div>
        </header>

        {/* =========================================
            スマホ専用：スライドしてくるフルスクリーンメニュー
        ========================================= */}
        <div className="fixed inset-0 bg-white z-50 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden overflow-y-auto flex flex-col">
          
          {/* メニュー上部（閉じるボタン） */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <span className="text-xs tracking-widest uppercase text-gray-400">MENU</span>
            <label htmlFor="global-mobile-menu" className="text-3xl cursor-pointer p-2 -mr-2 font-light text-black hover:opacity-50">
              ×
            </label>
          </div>

          {/* メニューの中身（ページリンク ＋ カテゴリ） */}
          <div className="p-8 flex flex-col gap-10 text-sm tracking-widest uppercase font-light">
            
            {/* メインページ群 */}
            <div className="flex flex-col gap-6">
              {/* ▼ 魔法：スマホメニューだけ <Link> ではなく <a> タグに書き換え！ */}
              <a href="/">HOME</a>
              <a href="/store">STORE</a>
              <a href="/about">ABOUT</a>
            </div>

            <hr className="border-gray-100" />

            {/* カテゴリ群 */}
            <div className="flex flex-col gap-6 text-xs">
              <span className="text-[10px] text-gray-400 mb-2">CATEGORY</span>
              {/* ▼ ここもすべて <a> タグに書き換え！ */}
              <a href="/store" className="hover:text-gray-500">ALL ITEMS</a>
              <a href="/store?tag=outerwear" className="hover:text-gray-500">OUTERWEAR</a>
              <a href="/store?tag=tops" className="hover:text-gray-500">TOPS</a>
              <a href="/store?tag=pants" className="hover:text-gray-500">PANTS</a>
            </div>

          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-gray-50 text-gray-400 p-8 text-center mt-auto border-t border-gray-100">
          <p className="tracking-widest text-[10px] md:text-xs font-light">
            © {new Date().getFullYear()} assemble store. All rights reserved.
          </p>
        </footer>

      </body>
    </html>
  );
}