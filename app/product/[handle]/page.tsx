// app/product/[handle]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

async function getProduct(handle: string) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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
        variants(first: 1) {
          edges {
            node {
              id
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
  const originalTags = product.tags; // ★名前を originalTags に変更しました
  const isAvailable = product.availableForSale;
  const variantId = product.variants.edges[0]?.node.id;

  return (
    <main className="min-h-screen bg-white text-black font-sans antialiased">
      
      {/* 戻るボタンの余白を調整 */}
      <div className="px-6 md:px-12 py-10 md:py-16">
        <Link href="/store" className="text-[9px] tracking-[.25em] text-gray-400 hover:text-black transition-colors duration-500 uppercase">
          Back to Store
        </Link>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32 flex flex-col md:flex-row gap-12 md:gap-24 lg:gap-32">

        {/* 左側（画像エリア） */}
        {/* 画像の幅を少し広げ（md:w-[65%]）、余白をなくす */}
        <div className="w-full md:w-[65%]">
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide gap-4 md:gap-1">
              {images.map((img: any, index: number) => (
              // 背景を白にし、object-cover でコンテナいっぱいに広げる（multiplyは削除）
              <div key={index} className="min-w-full md:min-w-0 snap-center bg-white flex items-center justify-center">
                  <img src={img.url} alt={img.altText || title} className="w-full h-full object-cover" />
              </div>
              ))}
          </div>

          <div className="flex md:hidden justify-center gap-2 mt-6">
              {images.map((_: any, i: number) => (
              <div key={i} className="w-[3px] h-[3px] bg-gray-300 rounded-full"></div>
              ))}
          </div>
        </div>

        {/* 右側（情報エリア） */}
        {/* スクロールの追従位置（top）を調整し、幅を絞る */}
        <div className="w-full md:w-[35%] relative">
          <div className="md:sticky md:top-40 flex flex-col">
            
            {/* タグ */}
            <div className="text-[9px] tracking-[.25em] text-gray-400 uppercase mb-6 flex flex-wrap items-center">
            {originalTags && originalTags.length > 0 ? (
                originalTags.map((tag: string, index: number) => {
                // ここでリンク用のURL（小文字＆ハイフン）を生成
                const tagUrl = tag.toLowerCase().replace(/\s+/g, '-');
                return (
                    <span key={index} className="flex items-center">
                    <Link 
                        href={`/store?tag=${tagUrl}`} 
                        className="hover:text-black transition-colors duration-300"
                    >
                        {tag}
                    </Link>
                    {/* 最後のタグ以外にはスラッシュをつける */}
                    {index < originalTags.length - 1 && (
                        <span className="mx-2">/</span>
                    )}
                    </span>
                );
                })
            ) : (
                <Link href="/store" className="hover:text-black transition-colors duration-300">
                ARCHIVE
                </Link>
            )}
            </div>

            {/* タイトル（少し小さく、行間を広げる） */}
            <h1 className="text-sm md:text-[15px] font-normal tracking-wider mb-2 leading-loose text-black uppercase">
              {title}
            </h1>
            
            {/* 価格（タイトルとの距離を詰め、説明文との距離を広げる） */}
            <p className="text-[14px] tracking-widest text-gray-800 mb-8">
              ¥ {price} JPY
            </p>

            {/* 説明文（フォントを極限まで洗練） */}
            <div 
              className="prose prose-sm font-light text-gray-700 tracking-wider leading-[2.2] text-[11px] mb-16 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            {/* カートボタン（無機質でシャープに） */}
            <div className="mb-16">
               <AddToCartButton variantId={variantId} isAvailable={isAvailable} />
            </div>

            {/* 規約アコーディオンエリア（線を細く、文字を上品に） */}
            <div className="flex flex-col border-t border-gray-100 pt-6 text-[10px] tracking-[.15em] text-black uppercase">
              
              <details className="group border-b border-gray-100 pb-4 mb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none outline-none hover:text-gray-500 transition-colors">
                  <span>Store Policy</span>
                  <span className="group-open:rotate-45 transition-transform duration-500 text-xs font-light">+</span>
                </summary>
                <div className="mt-5 lowercase leading-loose text-gray-500 normal-case tracking-wider">
                  {storePolicy ? (
                    <div className="prose prose-sm text-[10px] leading-[2.2] whitespace-pre-line" dangerouslySetInnerHTML={{ __html: storePolicy }} />
                  ) : (
                    <p className="text-[10px]">Loading Error</p>
                  )}
                </div>
              </details>

              <details className="group border-b border-gray-100 pb-4 mb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none outline-none hover:text-gray-500 transition-colors">
                  <span>Payments & Shipping</span>
                  <span className="group-open:rotate-45 transition-transform duration-500 text-xs font-light">+</span>
                </summary>
                <div className="mt-5 lowercase leading-loose text-gray-500 normal-case tracking-wider">
                  {shippingPolicy ? (
                    <div className="prose prose-sm text-[10px] leading-[2.2] whitespace-pre-line" dangerouslySetInnerHTML={{ __html: shippingPolicy }} />
                  ) : (
                    <p className="text-[10px]">Loading Error</p>
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