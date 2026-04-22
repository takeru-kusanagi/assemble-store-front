// app/store/page.tsx (商品一覧 / Baseみたいな感じの部分)
import Link from 'next/link';

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function getProducts() {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;
  const query = `
    {
      products(first: 20) { # 20個まで取得するように変更
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
  });

  const json = await res.json();
  return json.data.products.edges;
}

export default async function StorePage() {
  const products = await getProducts();

  return (
    // ★Heroセクションを完全に削除！
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      
      {/* 商品一覧セクション。余白（p-6 md:p-12）をBase風に */}
      <div className="p-6 md:p-12 max-w-7xl mx-auto mt-4">
        
        {/* 商品グリッド。PCなら3列、スマホなら1列。gap-12で余白を広めに */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {products.map(({ node }: any) => (
            <Link 
              href={`/product/${node.handle}`} 
              key={node.id} 
              className="group block"
            >
              {node.images.edges[0] && (
                // Base特有の「正方形」の商品画像にする（aspect-square）
                <div className="overflow-hidden bg-gray-50 mb-5 aspect-square border border-gray-100">
                  <img
                    src={node.images.edges[0].node.url}
                    alt={node.title}
                    // 画像を正方形の中に完璧にフィットさせる（object-cover）
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              
              {/* 商品情報。フォントを細め（font-light）にして洗練させる */}
              <div className="text-center">
                <h3 className="text-sm font-light tracking-widest mb-1 text-black group-hover:text-gray-500 transition">
                  {node.title}
                </h3>
                <p className="text-sm font-light text-gray-500 tracking-wider">
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