// app/store/page.tsx
import Link from 'next/link';

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function getProducts() {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
    },
    body: JSON.stringify({ query }),
    cache: 'no-store', 
  });

  const json = await res.json();
  return json.data.products.edges;
}

export default async function StorePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased relative">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row gap-12 md:gap-32 lg:gap-60">

        {/* =========================================
            スマホ専用：フィルター呼び出しボタン
        ========================================= */}
        <div className="md:hidden flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-[10px] tracking-widest text-gray-400">{products.length} ITEMS</span>
          {/* このラベルをクリックすると、下のチェックボックスがONになる魔法 */}
          <label htmlFor="mobile-menu" className="text-xs tracking-widest uppercase cursor-pointer text-black hover:text-gray-500 transition">
            + Filter
          </label>
        </div>

        {/* 魔法の仕掛け（画面には見えないチェックボックス） */}
        <input type="checkbox" id="mobile-menu" className="peer hidden" />

        {/* =========================================
            左側：サイドバー（スマホ：右からスライドイン / PC：左固定）
        ========================================= */}
        <aside className="
          fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-8 overflow-y-auto transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:translate-x-0
          md:static md:w-48 md:shrink-0 md:p-0 md:transform-none md:bg-transparent md:z-auto md:overflow-visible md:sticky md:top-32 h-fit
        ">
          
          {/* スマホ専用：閉じるボタン */}
          <div className="flex justify-between items-center md:hidden mb-12">
            <span className="text-xs tracking-widest uppercase text-gray-400">Filter</span>
            <label htmlFor="mobile-menu" className="text-2xl cursor-pointer p-2 -mr-2 font-light text-gray-400 hover:text-black">×</label>
          </div>

          {/* メニュー群（内容はそのまま） */}
          <div className="flex flex-col gap-12 text-[10px] tracking-widest uppercase">
            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">Category</h2>
              <Link href="/store" className="hover:text-gray-500 transition">All</Link>
              <Link href="/store?tag=outerwear" className="hover:text-gray-500 transition">Outerwear</Link>
              <Link href="/store?tag=tops" className="hover:text-gray-500 transition">Tops</Link>
              <Link href="/store?tag=pants" className="hover:text-gray-500 transition">Pants</Link>
              <Link href="/store?tag=accessories" className="hover:text-gray-500 transition">Accessories</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">Concept</h2>
              <Link href="/store?tag=vintage" className="hover:text-gray-500 transition">Vintage</Link>
              <Link href="/store?tag=archive" className="hover:text-gray-500 transition">Archive</Link>
              <Link href="/store?tag=designers" className="hover:text-gray-500 transition">Designers</Link>
              <Link href="/store?tag=outdoor" className="hover:text-gray-500 transition">Outdoor</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">Brand</h2>
              <Link href="/store?tag=arcteryx" className="hover:text-gray-500 transition">Arc'teryx</Link>
              <Link href="/store?tag=jil-sander" className="hover:text-gray-500 transition">Jil Sander</Link>
              <Link href="/store?tag=maison-margiela" className="hover:text-gray-500 transition">Maison Margiela</Link>
              <Link href="/store?tag=unknown" className="hover:text-gray-500 transition">Unknown</Link>
            </div>
          </div>
        </aside>

        {/* スマホ専用：メニューが開いている時の背景を少し暗くする（クリックで閉じる） */}
        <label htmlFor="mobile-menu" className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden peer-checked:block md:hidden cursor-pointer"></label>

        {/* =========================================
            右側：商品一覧グリッド
        ========================================= */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
          
          {products.map(({ node }: any) => (
            <Link href={`/product/${node.handle}`} key={node.id} className="group block">
              {node.images.edges[0] && (
                <div className="overflow-hidden bg-[#f9f9f9] mb-4 md:mb-5 aspect-square border border-gray-100 flex items-center justify-center">
                  <img
                    src={node.images.edges[0].node.url}
                    alt={node.title}
                    className="w-full h-full object-contain mix-blend-multiply transition duration-700 group-hover:scale-105 p-4"
                  />
                </div>
              )}
              <div className="text-left flex flex-col gap-1">
                <h3 className="text-[11px] md:text-xs font-light tracking-widest text-black group-hover:text-gray-500 transition leading-snug">
                  {node.title}
                </h3>
                <p className="text-[10px] font-light text-gray-500 tracking-wider">
                  ¥{parseInt(node.priceRange.minVariantPrice.amount).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
          
        </div>

      </div>
    </main>
  );
}