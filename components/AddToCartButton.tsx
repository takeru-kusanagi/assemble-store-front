// src/components/AddToCartButton.tsx
"use client";

import { useCart } from "./CartProvider";

export default function AddToCartButton({ variantId, isAvailable }: { variantId: string, isAvailable: boolean }) {
  const { addVariantToCart, isAdding } = useCart();

  if (!isAvailable) {
    return (
      <button disabled className="w-full bg-transparent text-gray-400 py-[14px] text-[10px] tracking-[.3em] cursor-not-allowed border border-gray-200 uppercase">
        Sold Out
      </button>
    );
  }

  return (
    <button 
      onClick={() => addVariantToCart(variantId)}
      disabled={isAdding}
      className="w-full bg-black text-white py-[14px] text-[10px] tracking-[.3em] hover:bg-gray-800 transition-colors duration-500 uppercase disabled:opacity-50"
    >
      {isAdding ? "Adding..." : "Add to Bag"}
    </button>
  );
}