// app/legal/page.tsx
import Link from 'next/link';

export default function LegalPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white text-gray-900 font-sans antialiased p-6 md:p-12 flex flex-col items-center">
      
      <div className="max-w-2xl w-full mt-10 md:mt-20 mb-20">
        
        <h1 className="text-[10px] font-medium tracking-[.3em] mb-16 text-center text-gray-400">
          特定商取引法に基づく表記
        </h1>
        
        {/* 項目の間隔を少し空けて、見やすく美しいリスト形式にしています */}
        <div className="text-xs md:text-sm text-gray-600 leading-loose tracking-wide space-y-8">
          
          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">販売者</h2>
            <p>assemble store</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">責任代表</h2>
            <p>草薙岳</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">住所</h2>
            <p>
              〒156-0043<br />
              日本 東京都 世田谷区 松原1-56-23 松原マンション313
            </p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">電話番号</h2>
            <p>070 7793 4845</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">メールアドレス</h2>
            <p>assemble.store.contact@gmail.com</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">サポート時間</h2>
            <p>
              平日 11:00〜18:00（土日祝日を除く）<br />
              ※お問い合わせは24時間受け付けておりますが、ご返信は基本的に営業時間内となります。
            </p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">販売価格</h2>
            <p>各商品ページに記載（表示価格は消費税込）</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">配送手数料</h2>
            <p>配送先の地域によって異なります。詳細はチェックアウト（決済）画面にて計算され表示されます。</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">追加料金 (商品価格以外)</h2>
            <p>上記情報には追加料金はありません</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">商品配達期間</h2>
            <p>ご注文確定後、通常1〜3営業日以内に発送いたします。</p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">決済方法とタイミング</h2>
            <p>
              クレジットカード決済（Visa, Mastercard, American Express）、Apple Pay、Google Pay がご利用いただけます。<br />
              また、ご注文確定時にお支払いが確定いたします。
            </p>
          </div>

          <div>
            <h2 className="font-medium text-black mb-1 tracking-widest">返品・返金ポリシー</h2>
            <p>
              商品の特性上、お客様都合による返品・交換・キャンセルは原則としてお受けしておりません。<br />
              商品の状態につきましては、写真と詳細文をよくご確認の上、ご購入をお願いいたします。万が一、お届けした商品に当店の過失（明らかな誤送など）による不備がございましたら、大変お手数ですが商品到着後3日以内にメールにてご連絡をお願いいたします。<br />
              当店の過失による返品の場合、返品にかかる送料は当店が負担いたします（着払いにてご返送ください）。
            </p>
          </div>

        </div>
        
        <div className="text-center mt-24">
          <Link href="/store" className="text-[10px] tracking-[.2em] text-gray-400 hover:text-black transition duration-500">
            ← BACK TO STORE
          </Link>
        </div>
        
      </div>
    </main>
  );
}