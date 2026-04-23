// app/store/page.tsx
import Link from 'next/link';

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// app/store/page.tsx の上部（getStoreData関数を丸ごと書き換え！）

async function getStoreData(tag?: string) {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;

  // =================================================================
  // パターンA：タグが選ばれている時（今まで通り、タグで商品を絞り込む）
  // =================================================================
  const queryWithTag = `
    query getProductsByTag($query: String!) {
      products(first: 20, query: $query) {
        edges {
          node {
            id
            title
            handle
            priceRange { minVariantPrice { amount } }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
      menu(handle: "brands") { items { title } }
    }
  `;

  // =================================================================
  // パターンB：Allの時（Shopifyの「all-items」コレクションを【手動並び順】で取得）
  // =================================================================
  const queryCollection = `
    query getCollectionProducts {
      collection(handle: "all-items") {
        # ★ここが魔法！ sortKey: MANUAL で、タケルさんのドラッグ＆ドロップ順を完璧に再現します
        products(first: 20, sortKey: MANUAL) {
          edges {
            node {
              id
              title
              handle
              priceRange { minVariantPrice { amount } }
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
      menu(handle: "brands") { items { title } }
    }
  `;

  // タグがあればパターンA、なければパターンBの要求書を使う
  const query = tag ? queryWithTag : queryCollection;
  const variables = tag ? { query: `tag:${tag}` } : {};

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', 
  });

  const json = await res.json();
  
  // タグの有無によって、Shopifyから返ってくるデータの「場所」が違うので整える
  const productsEdges = tag 
    ? json.data?.products?.edges || [] 
    : json.data?.collection?.products?.edges || [];

  return {
    products: productsEdges,
    brands: json.data?.menu?.items || [],
  };
}

// （この下の export default async function StorePage... はそのまま！）

// ★変更3：Next.jsの仕様変更に合わせ、searchParams を非同期で受け取る
export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // URLの ?tag=〇〇 の部分を取得
  const resolvedSearchParams = await searchParams;
  const tag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : undefined;

  // tagを渡してデータを取得
  const { products, brands } = await getStoreData(tag);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased relative">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row gap-12 md:gap-18 lg:gap-4">

        {/* =========================================
            左側：サイドバー（PCのみ表示）
        ========================================= */}
        <aside className="hidden md:block w-48 shrink-0 sticky top-32 h-fit">
          <div className="flex flex-col gap-12 text-[10px] tracking-widest uppercase">
            
            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">Category</h2>
              <Link href="/store" className={`transition ${!tag ? 'text-black' : 'text-gray-500 hover:text-black'}`}>All</Link>
              <Link href="/store?tag=outerwear" className={`transition ${tag === 'outerwear' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Outerwear</Link>
              <Link href="/store?tag=tops" className={`transition ${tag === 'tops' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Tops</Link>
              <Link href="/store?tag=pants" className={`transition ${tag === 'pants' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Pants</Link>
              <Link href="/store?tag=accessories" className={`transition ${tag === 'accessories' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Accessories</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">Concept</h2>
              <Link href="/store?tag=american-casual" className={`transition ${tag === 'american-casual' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>American casual</Link>
              <Link href="/store?tag=designers" className={`transition ${tag === 'designers' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Designers</Link>
              <Link href="/store?tag=vintage" className={`transition ${tag === 'vintage' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Vintage</Link>
              <Link href="/store?tag=outdoor" className={`transition ${tag === 'outdoor' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Outdoor</Link>
              <Link href="/store?tag=others" className={`transition ${tag === 'others' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Others</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">Brand</h2>
              {brands.length > 0 ? (
                brands.map((brand: any, index: number) => {
                  const tagUrl = brand.title.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link 
                      key={index} 
                      href={`/store?tag=${tagUrl}`} 
                      className={`transition ${tag === tagUrl ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                      {brand.title}
                    </Link>
                  );
                })
              ) : (
                <span className="text-gray-300">NO BRANDS YET</span>
              )}
            </div>

          </div>
        </aside>

        {/* =========================================
            右側：商品一覧グリッド
        ========================================= */}
        <div className="flex-1">
          {/* 検索結果が0件だった場合のメッセージ */}
          {products.length === 0 ? (
            <div className="text-center py-20 text-xs tracking-widest text-gray-400 uppercase">
              No items found for "{tag}"
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-2 md:gap-y-8">
              {products.map(({ node }: any) => (
                <Link href={`/product/${node.handle}`} key={node.id} className="group block">
                  {node.images.edges[0] && (
                    <div className="overflow-hidden mb-4 md:mb-5 aspect-square border border-gray-100 flex items-center justify-center bg-white">
                    <img
                      src={node.images.edges[0].node.url}
                      alt={node.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
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
          )}
        </div>

      </div>
    </main>
  );
}