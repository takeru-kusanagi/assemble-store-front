// src/app/product/[handle]/page.tsx
import Link from 'next/link';
// ★追加：別のURLにユーザーを強制ワープ（リダイレクト）させる魔法の関数
import { redirect } from 'next/navigation';

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function getProduct(handle: string) {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;

  const query = `
    {
      product(handle: "${handle}") {
        id
        title
        description
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
        variants(first: 1) {
          edges {
            node {
              id
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
  return json.data.product;
}

export default async function ProductDetail({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return <div className="p-10 text-center font-sans">商品が見つかりませんでした。</div>;
  }

  // ★追加：カートを作成して、Shopifyの決済画面に飛ぶ「Server Action」
  async function createCartAndCheckout() {
    "use server"; // この関数は裏側のサーバーでだけ動かす、という絶対の掟

    // 取得しておいたバリエーションIDを取り出す
    const variantId = product.variants.edges[0].node.id;

    // Cartを作るための「書き込み用」の要求書（Mutation）
    const mutationQuery = `
      mutation {
        cartCreate(
          input: {
            lines: [
              {
                merchandiseId: "${variantId}",
                quantity: 1
              }
            ]
          }
        ) {
          cart {
            checkoutUrl
          }
        }
      }
    `;

    // Shopifyに「カート作って！」と送信
    const res = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({ query: mutationQuery }),
    });

    const json = await res.json();
    
    // Shopifyが作ってくれた「あなた専用の決済画面のURL」を受け取る
    const checkoutUrl = json.data.cartCreate.cart.checkoutUrl;

    // そのURLにユーザーを強制ワープ！
    redirect(checkoutUrl);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/store" className="text-gray-400 hover:text-black transition tracking-widest text-sm">
          ← BACK TO STORE
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
        <div className="md:w-1/2">
          {product.images.edges[0] && (
            <img
              src={product.images.edges[0].node.url}
              alt={product.title}
              className="w-full h-auto object-cover bg-gray-50 border border-gray-100"
            />
          )}
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black tracking-wide">
            {product.title}
          </h1>
          <p className="text-2xl text-gray-500 mb-8">
            ¥{parseInt(product.priceRange.minVariantPrice.amount).toLocaleString()}
          </p>
          <div className="mb-12 leading-relaxed text-gray-800 whitespace-pre-wrap">
            {product.description}
          </div>

          {/* ★変更：ボタンを form で囲み、action にさっきの関数をセットする */}
          <form action={createCartAndCheckout}>
            <button type="submit" className="bg-black text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 transition duration-300 w-full text-center tracking-widest">
              ADD TO CART
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}