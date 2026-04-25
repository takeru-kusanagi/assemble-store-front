
// src/components/CartIcon.tsx
"use client";

import { useCart } from "./CartProvider";

export default function CartIcon() {
  const { cart } = useCart();
  
  // カートの中のアイテムの合計数を計算する
  const itemCount = cart?.lines?.edges?.reduce((total, edge) => total + edge.node.quantity, 0) || 0;

  return (
    <>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M5 8H19V21H5V8Z" />
        <path d="M9 8V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V8" />
      </svg>
      <span className="text-[11px] font-light mt-[2px]">{itemCount}</span>
    </>
  );
}