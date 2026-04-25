// src/app/actions/cart.ts
"use server";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function shopifyFetch(query: string, variables: any = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token!,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  return res.json();
}

// （共通で使う「カートの中身」の要求書）
const cartFragment = `
  id
  checkoutUrl
  cost {
    totalAmount { amount }
  }
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount }
            product { title handle }
            image { url altText }
          }
        }
      }
    }
  }
`;

// 1. 新しいカートを作る
export async function createCart() {
  const query = `mutation { cartCreate(input: {}) { cart { ${cartFragment} } } }`;
  const res = await shopifyFetch(query);
  return res.data?.cartCreate?.cart;
}

// 2. カートに商品を追加する
export async function addToCart(cartId: string, variantId: string) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${cartFragment} } }
    }
  `;
  const res = await shopifyFetch(query, { cartId, lines: [{ merchandiseId: variantId, quantity: 1 }] });
  return res.data?.cartLinesAdd?.cart;
}

// ★追加3. 既存のカートの「今の中身」を取得する（リロード対策）
export async function getCart(cartId: string) {
  const query = `query getCart($cartId: ID!) { cart(id: $cartId) { ${cartFragment} } }`;
  const res = await shopifyFetch(query, { cartId });
  return res.data?.cart;
}

// ★追加4. カートから商品を削除する
export async function removeFromCart(cartId: string, lineId: string) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${cartFragment} } }
    }
  `;
  const res = await shopifyFetch(query, { cartId, lineIds: [lineId] });
  return res.data?.cartLinesRemove?.cart;
}