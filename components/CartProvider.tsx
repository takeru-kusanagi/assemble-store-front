// src/components/CartProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// ★新しく作った getCart と removeFromCart もインポートする
import { createCart, addToCart, getCart, removeFromCart } from "@/app/actions/cart";

type CartType = {
  id: string;
  checkoutUrl: string;
  lines: { edges: any[] };
  cost: { totalAmount: { amount: string } };
};

type CartContextType = {
  cart: CartType | null;
  isAdding: boolean;
  addVariantToCart: (variantId: string) => Promise<void>;
  // ★削除用の関数を型に追加
  removeCartItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartType | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // ★変更：画面が開いた時、Shopifyから「本当のカートの中身」をもらってくる
  useEffect(() => {
    const fetchSavedCart = async () => {
      const savedCartId = localStorage.getItem("shopify_cart_id");
      if (savedCartId) {
        const existingCart = await getCart(savedCartId);
        if (existingCart) {
          setCart(existingCart); // 中身があれば復元！
        } else {
          localStorage.removeItem("shopify_cart_id"); // 古くて消えていたら記憶をリセット
        }
      }
    };
    fetchSavedCart();
  }, []);

  const addVariantToCart = async (variantId: string) => {
    setIsAdding(true);
    try {
      let currentCartId = cart?.id;
      if (!currentCartId) {
        const newCart = await createCart();
        currentCartId = newCart.id;
        localStorage.setItem("shopify_cart_id", currentCartId!);
      }
      const updatedCart = await addToCart(currentCartId!, variantId);
      setCart(updatedCart);

      const cartDrawer = document.getElementById("cart-drawer") as HTMLInputElement;
      if (cartDrawer) cartDrawer.checked = true;
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  // ★追加：カートから商品を削除する魔法
  const removeCartItem = async (lineId: string) => {
    if (!cart?.id) return;
    try {
      // 削除中のUIは一旦省きますが、Shopifyに削除を依頼してカートを上書きします
      const updatedCart = await removeFromCart(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, isAdding, addVariantToCart, removeCartItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
}