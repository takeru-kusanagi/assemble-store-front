// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css"; // Next.jsの基本スタイルを読み込む

// サイト全体のタイトルや説明（SEO対策）
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
      {/* 画面全体の基本設定：背景白、文字グレー、画面の高さを最低でも画面いっぱいに（min-h-screen） */}
      <body className="bg-white text-gray-900 font-sans antialiased flex flex-col min-h-screen">
        
        {/* ▼▼▼ 全ページ共通のヘッダー ▼▼▼ */}
        {/* sticky top-0: スクロールしても上に追従する / backdrop-blur: 背景が少し透けてすりガラスになる魔法 */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-6 md:px-12">
            
            {/* 左側：ロゴ（クリックでトップへ） */}
            <Link href="/" className="text-2xl font-bold tracking-widest text-black hover:opacity-70 transition">
              assemble store
            </Link>
            
            {/* 右側：メニュー */}
            <nav className="flex gap-8 text-sm tracking-widest font-bold">
              <Link href="/" className="hover:text-gray-400 transition">HOME</Link>
              <Link href="#" className="hover:text-gray-400 transition">ABOUT</Link>
            </nav>
          </div>
        </header>
        {/* ▲▲▲ ヘッダーここまで ▲▲▲ */}

        {/* 各ページの中身（page.tsxの内容）がこの children の部分に自動的に入ります */}
        <main className="flex-grow">
          {children}
        </main>

        {/* ▼▼▼ 全ページ共通のフッター ▼▼▼ */}
        <footer className="bg-black text-white p-12 text-center mt-auto">
          <p className="tracking-widest text-xs text-gray-500">
            © {new Date().getFullYear()} Assemble store DX. All rights reserved.
          </p>
        </footer>
        {/* ▲▲▲ フッターここまで ▲▲▲ */}

      </body>
    </html>
  );
}