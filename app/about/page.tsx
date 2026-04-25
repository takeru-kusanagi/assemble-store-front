// app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white text-gray-900 font-sans antialiased p-6 md:p-12 flex items-center justify-center">
      {/* ▲変更：flex items-center justify-center で画面のド真ん中に配置 */}

      <div className="max-w-xl mx-auto w-full -mt-20">
        {/* ▲変更：-mt-20 で少しだけ上にズラす（視覚的な中心は物理的な中心より少し上にあるため） */}
        
        <h1 className="text-[10px] font-medium tracking-[.3em] mb-20 text-center text-gray-400">
          {/* ▲変更：ABOUTの文字をあえて小さく、グレーにして主張を消す */}
          ABOUT
        </h1>
        
        {/* ▼変更：テキストを中央揃え（text-center）にし、文字サイズを少し大きく（text-lg） */}
        <div className="space-y-8 text-xs md:text-base font-medium leading-relaxed tracking-widest text-black text-center">
          <p>
            Nothing is complete on its own.
          </p>
          <p>
            We gather the fragments.
          </p>
          <p>
            You form the whole.
          </p>
        </div>
        
        <div className="text-center mt-20">
          <Link href="/store" className="text-[10px] tracking-[.2em] text-gray-400 hover:text-black transition duration-500">
            ← BACK TO STORE
          </Link>
        </div>
        
      </div>
    </main>
  );
}