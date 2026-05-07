'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getMoreProducts } from '@/app/actions/shopify';

export default function ProductGrid({ initialProducts, initialPageInfo, tag }: any) {
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!pageInfo.hasNextPage || loading) return;
    setLoading(true);
    
    try {
      // Step 1で作った裏方関数を呼び出して続きを取得
      const { edges, pageInfo: newPageInfo } = await getMoreProducts(tag, pageInfo.endCursor);
      setProducts([...products, ...edges]);
      setPageInfo(newPageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-xs tracking-widest text-gray-400 uppercase">
        No items found for "{tag}"
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pb-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7 md:gap-x-2 md:gap-y-8 w-full">
        {products.map(({ node }: any) => {
          const isSoldOut = !node.availableForSale;

          return (
            <Link 
              href={`/product/${node.handle}`} 
              key={node.id} 
              className={`group block ${isSoldOut ? 'opacity-80 hover:opacity-100' : ''}`}
            >
              {node.images.edges[0] && (
                <div className="overflow-hidden mb-4 md:mb-5 aspect-square border border-gray-100 flex items-center justify-center bg-white relative">
                  <img
                    src={node.images.edges[0].node.url}
                    alt={node.title}
                    className={`w-full h-full object-cover transition duration-700 ${isSoldOut ? 'opacity-80' : 'group-hover:scale-105'}`}
                  />
                </div>
              )}
              
              <div className="text-left flex flex-col gap-1.5 pr-2 md:pr-6">
                <h3 className={`text-[11px] md:text-xs font-light tracking-widest leading-[1.4] transition ${isSoldOut ? 'text-gray-400' : 'text-black group-hover:text-gray-500'}`}>
                  {node.title}
                </h3>
                <p className="text-[10px] font-medium tracking-wider mt-0.5">
                  {isSoldOut ? (
                    <span className="text-red-700">SOLD OUT</span>
                  ) : (
                    <span className="text-gray-500">¥{parseInt(node.priceRange.minVariantPrice.amount).toLocaleString()}</span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 次のページがある場合のみ、Load Moreボタンを表示 */}
      {pageInfo.hasNextPage && (
        <button 
          onClick={loadMore}
          disabled={loading}
          className="mt-20 text-[10px] tracking-widest uppercase text-gray-500 hover:text-black transition-colors border border-gray-300 px-12 py-3 disabled:opacity-50"
        >
          {loading ? 'LOADING...' : 'LOAD MORE'}
        </button>
      )}
    </div>
  );
}