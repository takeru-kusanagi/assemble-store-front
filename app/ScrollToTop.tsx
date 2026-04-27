
'use client'; // ★重要：これはブラウザ側で動かすという宣言

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // ブラウザの「さっきの場所を覚える機能」をマニュアル（手動）に変更
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // 強制的に一番上（X:0, Y:0）へスクロールさせる
    window.scrollTo(0, 0);
  }, []);

  return null; // 見た目は何もない透明なコンポーネント
}