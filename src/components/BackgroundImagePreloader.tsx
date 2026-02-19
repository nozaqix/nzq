'use client';

import { useEffect } from 'react';

interface BackgroundImagePreloaderProps {
  imageUrls: string[];
}

export default function BackgroundImagePreloader({ imageUrls }: BackgroundImagePreloaderProps) {
  useEffect(() => {
    if (imageUrls.length === 0) {
      return;
    }

    // バックグラウンドで画像をプリロード（ローディング画面は表示しない）
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);

  return null; // 何も表示しない
}



