'use client';

import { useEffect, useState } from 'react';

interface ImagePreloaderProps {
  imageUrls: string[];
  children: React.ReactNode;
}

export default function ImagePreloader({ imageUrls, children }: ImagePreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let loaded = 0;
    let errored = 0;
    const total = imageUrls.length;
    setTotalCount(total);

    const checkComplete = () => {
      if (loaded + errored >= total) {
        // すべての画像のロードが完了（成功または失敗）したら表示
        setIsLoading(false);
      }
    };

    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
          checkComplete();
        };
        
        img.onerror = () => {
          errored++;
          setLoadedCount(loaded + errored);
          resolve();
          checkComplete();
        };
        
        img.src = url;
      });
    };

    // すべての画像を並列でロード
    Promise.all(imageUrls.map(loadImage));
  }, [imageUrls]);

  if (isLoading) {
    const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;

    return (
      <div className="fixed inset-0 bg-[#111] flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-white text-xs font-inter mb-4">
            Now Loading...
          </p>
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

