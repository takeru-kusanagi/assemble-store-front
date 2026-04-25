// src/components/CartDrawer.tsx
"use client";

import { useCart } from "./CartProvider";

export default function CartDrawer() {
  // ★変更：removeCartItem を呼び出せるようにする
  const { cart, removeCartItem } = useCart();
  
  const itemCount = cart?.lines?.edges?.reduce((total, edge) => total + edge.node.quantity, 0) || 0;
  const items = cart?.lines?.edges || [];
  const totalAmount = cart?.cost?.totalAmount?.amount || "0";

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[420px] bg-[#f7f7f7] text-black transform translate-x-full peer-checked/cart:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-l border-gray-200">
      
      <div className="flex justify-between items-center p-6 border-b border-gray-200 shrink-0">
        <span className="text-xs tracking-[.2em] uppercase font-light">Your Bag ({itemCount})</span>
        <label htmlFor="cart-drawer" className="text-2xl cursor-pointer p-2 -mr-2 font-light hover:text-gray-400 transition-colors">
          ×
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" className="text-gray-300 mb-6">
              <path d="M5 8H19V21H5V8Z" />
              <path d="M9 8V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V8" />
            </svg>
            <p className="text-[11px] tracking-[.15em] text-gray-400 uppercase font-light text-center leading-loose">
              There are currently no items <br/> in your bag.
            </p>
          </div>
        ) : (
          items.map(({ node }: any) => (
            <div key={node.id} className="flex gap-4">
              <div className="w-20 h-24 bg-white flex items-center justify-center border border-gray-100 shrink-0">
                <img src={node.merchandise.image?.url} alt={node.merchandise.image?.altText || "Product"} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <h3 className="text-[10px] tracking-widest font-light uppercase leading-snug">{node.merchandise.product.title}</h3>
                  {node.merchandise.title !== "Default Title" && (
                    <p className="text-[9px] text-gray-400 mt-1 uppercase">{node.merchandise.title}</p>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] tracking-wider text-gray-400">QTY: {node.quantity}</p>
                    {/* ★追加：モードでミニマルな削除ボタン */}
                    <button 
                      onClick={() => removeCartItem(node.id)}
                      className="text-[9px] tracking-widest text-gray-400 hover:text-black uppercase text-left transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[10px] tracking-widest">¥ {parseInt(node.merchandise.price.amount).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-gray-200 bg-[#f7f7f7] shrink-0">
        <div className="flex justify-between text-[11px] tracking-widest font-light mb-6 uppercase text-gray-500">
          <span>Subtotal</span>
          <span>¥ {parseInt(totalAmount).toLocaleString()} JPY</span>
        </div>
        <a 
          href={cart?.checkoutUrl || "#"}
          className={`block text-center w-full bg-black text-white py-4 text-[10px] tracking-[.3em] uppercase font-medium transition-colors duration-300 ${items.length === 0 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-800'}`}
        >
          Checkout
        </a>
        <p className="text-[9px] tracking-widest text-gray-400 text-center mt-4 uppercase">
          Shipping & taxes calculated at checkout.
        </p>
      </div>

    </div>
  );
}