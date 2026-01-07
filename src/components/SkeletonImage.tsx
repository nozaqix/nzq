'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SkeletonImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  unoptimized?: boolean;
}

export default function SkeletonImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  unoptimized = false,
}: SkeletonImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* スケルトンスクリーン */}
      {isLoading && (
        <div className="w-full bg-gray-800/60 rounded-lg overflow-hidden" style={{ aspectRatio: `${width} / ${height}`, minHeight: '200px' }}>
          <div className="w-full h-full bg-gradient-to-r from-gray-800/40 via-gray-700/40 to-gray-800/40 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
      )}

      {/* 画像 */}
      {!hasError && (
        <div className={isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100 transition-opacity duration-300'}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
            unoptimized={unoptimized}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </div>
      )}

      {/* エラー時の表示 */}
      {hasError && (
        <div className="w-full bg-gray-800/60 rounded-lg flex items-center justify-center p-8" style={{ minHeight: '200px' }}>
          <p className="text-gray-500 text-xs">画像の読み込みに失敗しました</p>
        </div>
      )}
    </div>
  );
}

