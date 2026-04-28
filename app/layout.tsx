// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartIcon from "@/components/CartIcon";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: "assemble store",
  description: "Nothing is complete on its own. We gather the fragments. You form the whole.",
  openGraph: {
    title: "assemble store",
    description: "Nothing is complete on its own. We gather the fragments. You form the whole.",
    url: "https://assemble-store-front-git-main-takeru-kusanagis-projects.vercel.app/", // ★後で本番URLに書き換えます
    siteName: "assemble store",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image", // これを入れるとTwitterで画像が大きくカッコよく出ます！
  },
};

async function getBrands() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) return [];

  const query = `
    {
      menu(handle: "brands") {
        items {
          title
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
      cache: 'force-cache', 
    });
    const json = await res.json();
    return json.data?.menu?.items || [];
  } catch (error) {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const brands = await getBrands();

  return (
    <html lang="ja">
      <body className={`${inter.className} bg-white text-gray-900 antialiased flex flex-col min-h-screen`}>

        <CartProvider>
          
          {/* スマホメニュー用の魔法のスイッチ */}
          <input type="checkbox" id="global-mobile-menu" className="peer hidden" />
          
          {/* ★アップデート：カートドロワー用の魔法のスイッチ（peer/cart） */}
          <input type="checkbox" id="cart-drawer" className="peer/cart hidden" />

          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center p-5 md:px-12">
              
              {/* スマホ専用：左側のハンバーガー */}
              <div className="md:hidden flex items-center">
                <label htmlFor="global-mobile-menu" className="cursor-pointer p-2 -ml-2 flex flex-col gap-[5px]">
                  <div className="w-5 h-[1px] bg-black"></div>
                  <div className="w-5 h-[1px] bg-black"></div>
                  <div className="w-5 h-[1px] bg-black"></div>
                </label>
              </div>

              {/* ロゴ */}
              <div className="flex-1 text-center md:text-left">
                <Link href="/store" className="text-xl md:text-3xl font-bold tracking-widest text-black hover:opacity-70 transition">
                  assemble store
                </Link>
              </div>

              {/* PC専用：右側のナビゲーション */}
              <nav className="hidden md:flex gap-8 text-sm tracking-widest font-medium uppercase items-center">
                <Link href="/" className="hover:text-gray-400 transition">HOME</Link>
                <Link href="/store" className="hover:text-gray-400 transition">STORE</Link>
                <Link href="/about" className="hover:text-gray-400 transition">ABOUT</Link>
                
                {/* ★アップデート：PC用カートアイコン（スクショに合わせたスクエア型） */}
                <label htmlFor="cart-drawer" className="cursor-pointer hover:opacity-50 transition flex items-center gap-[6px]">
                  <CartIcon />
                </label>
              </nav>

              {/* ★アップデート：スマホ用カートアイコン */}
              <div className="md:hidden flex justify-end">
                <label htmlFor="cart-drawer" className="cursor-pointer p-2 -mr-2 hover:opacity-50 transition flex items-center gap-[4px]">
                  <CartIcon />
                </label>
              </div>

            </div>
          </header>

          {/* =========================================
              ★アップデート：洗練されたライトグレーのカートドロワー
          ========================================= */}
          {/* 背景の半透明の黒幕（少し薄めに調整） */}
          <label htmlFor="cart-drawer" className="fixed inset-0 bg-gray z-50 hidden peer-checked/cart:block backdrop-blur-sm cursor-pointer"></label>

          <CartDrawer />

          {/* =========================================
              スマホ専用メニュー（左からスライド）
          ========================================= */}
          <div className="fixed inset-0 bg-white z-50 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <span className="text-xs tracking-widest uppercase text-gray-400">MENU</span>
              <label htmlFor="global-mobile-menu" className="text-3xl cursor-pointer p-2 -mr-2 font-medium text-black hover:opacity-50">
                ×
              </label>
            </div>
            <div className="p-8 flex flex-col gap-12 text-sm tracking-widest uppercase font-medium pb-24">
              <div className="flex flex-col gap-4">
                <a href="/">HOME</a>
                <a href="/store">STORE</a>
                <a href="/about">ABOUT</a>
              </div>
              <hr className="border-gray-100" />
              <div className="flex flex-col gap-10 text-xs">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] text-gray-400 mb-1">CATEGORY</span>
                  <a href="/store" className="hover:text-gray-500">ALL</a>
                  <a href="/store?tag=outerwear" className="hover:text-gray-500">OUTERWEAR</a>
                  <a href="/store?tag=tops" className="hover:text-gray-500">TOPS</a>
                  <a href="/store?tag=pants" className="hover:text-gray-500">PANTS</a>
                  <a href="/store?tag=accessories" className="hover:text-gray-500">ACCESSORIES</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] text-gray-400 mb-1">CONCEPT</span>
                  <a href="/store?tag=american-casual" className="hover:text-gray-500">AMERICAN CASUAL</a>
                  <a href="/store?tag=designers" className="hover:text-gray-500">DESIGNERS</a>
                  <a href="/store?tag=vintage" className="hover:text-gray-500">VINTAGE</a>
                  <a href="/store?tag=outdoor" className="hover:text-gray-500">OUTDOOR</a>
                  <a href="/store?tag=others" className="hover:text-gray-500">OTHERS</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] text-gray-400 mb-1">BRAND</span>
                  {brands.length > 0 ? (
                    brands.map((brand: any, index: number) => {
                      const tagUrl = brand.title.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <a key={index} href={`/store?tag=${tagUrl}`} className="hover:text-gray-500">
                          {brand.title}
                        </a>
                      );
                    })
                  ) : (
                    <span className="text-gray-300">NO BRANDS YET</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-gray-50 text-gray-400 py-8 px-6 mt-auto border-t border-gray-100 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
            
            {/* ★法務ページへのリンク集 */}
            <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 text-[7px] tracking-[.15em] md:tracking-[.2em] font-medium">
              <Link href="/legal" className="hover:text-black transition-colors duration-300">
                LEGAL
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors duration-300 uppercase">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-black transition-colors duration-300 uppercase">
                Privacy Policy
              </Link>
            </div>

            {/* ★コピーライト */}
            <p className="tracking-widest text-[8px] md:text-[10px] font-light">
              © {new Date().getFullYear()} assemble store. All rights reserved.
            </p>
          </footer>

        </CartProvider>

      </body>
    </html>
  );
}