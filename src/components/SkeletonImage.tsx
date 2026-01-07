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
  priority?: boolean;
}

export default function SkeletonImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  unoptimized = false,
  priority = false,
}: SkeletonImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* スケルトンスクリーン */}
      {isLoading && (
        <div className="w-full overflow-hidden" style={{ aspectRatio: `${width} / ${height}`, minHeight: '200px', backgroundColor: 'rgb(120 120 120 / 0.4)' }}>
          <div 
            className="w-full h-full animate-shimmer" 
            style={{ 
              background: 'linear-gradient(to right, rgb(120 120 120 / 0.3), rgb(120 120 120 / 0.5), rgb(120 120 120 / 0.3))',
              backgroundSize: '200% 100%'
            }}
          ></div>
        </div>
      )}

      {/* 画像 */}
      {!hasError && (
        <div className={isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100 transition-opacity duration-300 w-full h-full'}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full ${className.includes('aspect-video') ? 'object-cover brightness-110' : 'h-auto'}`}
            unoptimized={unoptimized}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
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
        <div className="w-full flex items-center justify-center p-8" style={{ minHeight: '200px', backgroundColor: 'rgb(120 120 120 / 0.4)' }}>
          <p className="text-gray-500 text-xs">画像の読み込みに失敗しました</p>
        </div>
      )}
    </div>
  );
}

