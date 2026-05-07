'use client'; // ★重要

import { useState, useEffect } from 'react';

type ImageIndicatorsProps = {
  imageCount: number;
  containerId: string; // 画像リストのコンテナのidを受け取る
};

export default function ImageIndicators({ imageCount, containerId }: ImageIndicatorsProps) {
  // ★現在のページインデックスを管理するステート
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // サーバーサイドで生成された画像リストのコンテナを取得
    const container = document.getElementById(containerId);
    if (!container) return;

    // スクロールイベントのハンドラ
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;
      
      // どの画像が中央にあるかを計算
      const index = Math.round(scrollLeft / clientWidth);
      
      // インデックスを更新
      setCurrentIndex(index);
    };

    // イベントリスナーを追加
    container.addEventListener('scroll', handleScroll);

    // クリーンアップ関数
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerId]); // containerId が変わったら再実行

  return (
    <div className="flex md:hidden justify-center gap-2 mt-6">
      {/* インジケーター（点々）を生成 */}
      {[...Array(imageCount)].map((_, i) => (
        <div 
          key={i} 
          className={`w-[3px] h-[3px] rounded-full transition-colors duration-300 ${
            // ★変更：現在のインデックスと一致する場合、色を濃く（black）する
            i === currentIndex ? 'bg-black' : 'bg-gray-300'
          }`}
        ></div>
      ))}
    </div>
  );
}