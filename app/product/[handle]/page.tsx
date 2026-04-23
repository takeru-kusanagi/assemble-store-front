// app/product/[handle]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Shopifyから商品データと「2つの」ポリシーデータを取得
async function getProduct(handle: string) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  // ★修正：エイリアス（名前付け）を使って、2つのページを同時に要求する
  const query = `
    query ProductAndPolicyQuery($handle: String!) {
      product(handle: $handle) {
        title
        descriptionHtml
        tags
        availableForSale
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 20) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
      storePolicy: page(handle: "store-policy") {
        body
      }
      shippingPolicy: page(handle: "payments-shipping") {
        body
      }
    }
  `;

  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token!,
    },
    body: JSON.stringify({ query, variables: { handle } }),
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const json = await res.json();
  
  // ★修正：3つのデータをまとめて返す
  return {
    product: json.data?.product,
    storePolicy: json.data?.storePolicy?.body,
    shippingPolicy: json.data?.shippingPolicy?.body
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  const data = await getProduct(handle);

  if (!data || !data.product) notFound();

  const product = data.product;
  const storePolicy = data.storePolicy; 
  const shippingPolicy = data.shippingPolicy; 

  const title = product.title;
  const price = Math.floor(product.priceRange.minVariantPrice.amount).toLocaleString();
  const images = product.images.edges.map((edge: any) => edge.node);
  const tags = product.tags;
  const isAvailable = product.availableForSale;

  return (
    <main className="min-h-screen bg-white text-black font-sans antialiased">
      
      <div className="px-6 md:px-12 py-8">
        <Link href="/store" className="text-[10px] tracking-[.2em] text-gray-500 hover:text-black transition duration-300">
          ← BACK TO STORE
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-32 flex flex-col md:flex-row gap-12 md:gap-24">

        {/* 左側（画像エリア） */}
        <div className="w-full md:w-[60%]">
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide gap-4">
              {images.map((img: any, index: number) => (
              <div key={index} className="min-w-full md:min-w-0 snap-center bg-[#f9f9f9] flex items-center justify-center p-0 md:p-0">
                  <img src={img.url} alt={img.altText || title} className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              ))}
          </div>

          <div className="flex md:hidden justify-center gap-2 mt-4">
              {images.map((_: any, i: number) => (
              <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
              ))}
          </div>
        </div>

        {/* 右側（情報エリア） */}
        <div className="w-full md:w-[40%] relative">
          <div className="md:sticky md:top-32 flex flex-col">
            
            <div className="text-[10px] tracking-widest text-gray-500 uppercase mb-4">
              {tags.length > 0 ? tags.join(' / ') : 'ARCHIVE'}
            </div>

            <h1 className="text-base md:text-lg font-normal tracking-wide mb-4 leading-relaxed text-black">
              {title}
            </h1>
            
            <p className="text-xs tracking-widest text-gray-800 mb-10">
              ¥ {price}
            </p>

            <div 
              className="prose prose-sm font-light text-gray-900 tracking-wider leading-loose text-xs mb-12 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            <div className="mb-12 border-t border-gray-200 pt-8">
              {isAvailable ? (
                <button className="w-full bg-black text-white py-4 text-xs tracking-[.2em] hover:bg-gray-800 transition duration-300">
                  ADD TO BAG
                </button>
              ) : (
                <button disabled className="w-full bg-gray-100 text-gray-400 py-4 text-xs tracking-[.2em] cursor-not-allowed border border-gray-200">
                  SOLD OUT
                </button>
              )}
            </div>

            {/* ★規約アコーディオンエリア */}
            <div className="flex flex-col border-t border-gray-200 pt-8 text-[10px] tracking-widest text-black">
              
              {/* 1つ目：Store Policy (Condition & Returns) */}
              <details className="group border-b border-gray-100 pb-5 mb-5">
                <summary className="flex justify-between items-center cursor-pointer list-none outline-none">
                  <span>Store Policy</span>
                  <span className="group-open:rotate-45 transition-transform duration-300 text-sm">+</span>
                </summary>
                <div className="mt-6 lowercase leading-relaxed text-gray-500 normal-case tracking-normal">
                  {storePolicy ? (
                    <div className="prose prose-sm text-[11px] leading-loose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: storePolicy }} />
                  ) : (
                    <p className="text-[11px]">Loading Error</p>
                  )}
                </div>
              </details>

              {/* 2つ目：Payments & Shipping */}
              <details className="group border-b border-gray-100 pb-5 mb-5">
                <summary className="flex justify-between items-center cursor-pointer list-none outline-none">
                  <span>Payments & Shipping</span>
                  <span className="group-open:rotate-45 transition-transform duration-300 text-sm">+</span>
                </summary>
                <div className="mt-6 lowercase leading-relaxed text-gray-500 normal-case tracking-normal">
                  {shippingPolicy ? (
                    <div className="prose prose-sm text-[11px] leading-loose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: shippingPolicy }} />
                  ) : (
                    <p className="text-[11px]">Loading Error</p>
                  )}
                </div>
              </details>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}