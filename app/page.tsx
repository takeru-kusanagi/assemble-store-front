
import Link from 'next/link';

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function getProducts() {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;

  const query = `
    {
      products(first: 10) {
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

  if (!res.ok) {
    throw new Error('商品の取得に失敗しました');
  }

  const json = await res.json();
  return json.data.products.edges;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white text-gray-900 p-10 font-sans">
      <h1 className="text-4xl font-bold tracking-widest text-center mb-12 text-black">
        Assemble store DX
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map(({ node }: any) => (
          <Link 
            href={`/product/${node.handle}`} 
            key={node.id} 
            className="border border-gray-200 p-4 rounded-lg hover:border-gray-400 hover:shadow-lg transition duration-300 bg-white block"
          >
            {node.images.edges[0] && (
              <img
                src={node.images.edges[0].node.url}
                alt={node.title}
                className="w-full h-80 object-cover mb-4 rounded bg-gray-50"
              />
            )}
            <h2 className="text-xl font-bold tracking-wide mb-2 text-black">{node.title}</h2>
            <p className="text-gray-600">
              ¥{parseInt(node.priceRange.minVariantPrice.amount).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}