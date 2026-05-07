import Link from 'next/link';
import InstagramIcon from '@/components/InstagramIcon';
import ProductGrid from '@/components/ProductGrid'; // ★追加

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function getStoreData(tag?: string) {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;

  const queryWithTag = `
    query getProductsByTag($query: String!) {
      products(first: 250, query: $query) {
        pageInfo { hasNextPage endCursor } # ★追加：次があるかどうかの情報
        edges {
          node {
            id title handle availableForSale
            priceRange { minVariantPrice { amount } }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
      menu(handle: "brands") { items { title } }
    }
  `;

  const queryCollection = `
    query getCollectionProducts {
      collection(handle: "all-items") {
        products(first: 250, sortKey: MANUAL) {
          pageInfo { hasNextPage endCursor } # ★追加：次があるかどうかの情報
          edges {
            node {
              id title handle availableForSale
              priceRange { minVariantPrice { amount } }
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
      menu(handle: "brands") { items { title } }
    }
  `;

  const query = tag ? queryWithTag : queryCollection;
  const variables = tag ? { query: `tag:"${tag}"` } : {};

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
  const productsData = tag ? json.data?.products : json.data?.collection?.products;

  return {
    products: productsData?.edges || [],
    pageInfo: productsData?.pageInfo || { hasNextPage: false, endCursor: null },
    brands: json.data?.menu?.items || [],
  };
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const tag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : undefined;

  const { products, pageInfo, brands } = await getStoreData(tag);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased relative">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row gap-12 md:gap-18 lg:gap-4">

        {/* サイドバー */}
        <aside className="hidden md:block w-48 shrink-0 sticky bottom-32 self-start">
          <div className="flex flex-col gap-12 text-[10px] tracking-widest">
            
            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">CATEGORY</h2>
              <Link href="/store" className={`transition ${!tag ? 'text-black' : 'text-gray-500 hover:text-black'}`}>All</Link>
              <Link href="/store?tag=outerwear" className={`transition ${tag === 'outerwear' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Outerwear</Link>
              <Link href="/store?tag=tops" className={`transition ${tag === 'tops' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Tops</Link>
              <Link href="/store?tag=pants" className={`transition ${tag === 'pants' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Pants</Link>
              <Link href="/store?tag=accessories" className={`transition ${tag === 'accessories' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Accessories</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">CONCEPT</h2>
              <Link href="/store?tag=American casual" className={`transition ${tag === 'American casual' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>American casual</Link>
              <Link href="/store?tag=designers" className={`transition ${tag === 'designers' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Designers</Link>
              <Link href="/store?tag=vintage" className={`transition ${tag === 'vintage' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Vintage</Link>
              <Link href="/store?tag=outdoor" className={`transition ${tag === 'outdoor' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Outdoor</Link>
              <Link href="/store?tag=others" className={`transition ${tag === 'others' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Others</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-gray-400 mb-2">BRAND</h2>
              {brands.length > 0 ? (
                brands.map((brand: any, index: number) => {
                  const tagUrl = brand.title;
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

            <div className="flex flex-col gap-4 pt-0">
              <a 
                href="https://instagram.com/assemble.store" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black hover:opacity-50 transition-opacity w-fit"
              >
                <InstagramIcon />
              </a>
            </div>

          </div>
        </aside>

        {/* 商品一覧グリッド */}
        <div className="flex-1">
          <ProductGrid 
            key={tag || 'all'} 
            initialProducts={products} 
            initialPageInfo={pageInfo} 
            tag={tag} 
          />
        </div>

      </div>
    </main>
  );
}