'use server'

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function getMoreProducts(tag: string | undefined, cursor: string) {
  const endpoint = `https://${shopifyDomain}/api/2024-01/graphql.json`;

  const queryWithTag = `
    query getProductsByTag($query: String!, $cursor: String) {
      products(first: 250, after: $cursor, query: $query) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id title handle availableForSale
            priceRange { minVariantPrice { amount } }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
    }
  `;

  const queryCollection = `
    query getCollectionProducts($cursor: String) {
      collection(handle: "all-items") {
        products(first: 250, after: $cursor, sortKey: MANUAL) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              id title handle availableForSale
              priceRange { minVariantPrice { amount } }
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
    }
  `;

  const query = tag ? queryWithTag : queryCollection;
  const variables = tag ? { query: `tag:"${tag}"`, cursor } : { cursor };

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
    edges: productsData?.edges || [],
    pageInfo: productsData?.pageInfo || { hasNextPage: false, endCursor: null }
  };
}