'use client';

import { useEffect, useState } from 'react';

interface ImagePreloaderProps {
  imageUrls: string[];
  children: React.ReactNode;
}

const IMAGE_LOAD_TIMEOUT = 5000; // 5秒のタイムアウト

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
        let isResolved = false;
        
        // タイムアウトを設定
        const timeoutId = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            errored++;
            setLoadedCount(loaded + errored);
            resolve();
            checkComplete();
          }
        }, IMAGE_LOAD_TIMEOUT);
        
        img.onload = () => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeoutId);
            loaded++;
            setLoadedCount(loaded);
            resolve();
            checkComplete();
          }
        };
        
        img.onerror = () => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeoutId);
            errored++;
            setLoadedCount(loaded + errored);
            resolve();
            checkComplete();
          }
        };
        
        img.src = url;
      });
    };

    // すべての画像を並列でロード
    Promise.all(imageUrls.map(loadImage));
  }, [imageUrls]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#111] flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          {/* メインの光る輪 */}
          <div className="loading-ring">
            <div className="ring-layer ring-layer-1"></div>
            <div className="ring-layer ring-layer-2"></div>
            <div className="ring-layer ring-layer-3"></div>
          </div>
          
          {/* テキスト */}
          <p className="text-white text-xs font-inter mt-8 text-center">
            Now Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

