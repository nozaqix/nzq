'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  unoptimized?: boolean;
}

export default function AnimatedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  unoptimized = false,
}: AnimatedImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
            // 一度アニメーションしたら監視を停止
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        threshold: 0.1, // 10%が見えたら発火
        rootMargin: '0px 0px -50px 0px', // 少し早めに発火
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div
      ref={imgRef}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 blur-0'
          : 'opacity-0 blur-md'
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto rounded-lg"
        unoptimized={unoptimized}
      />
    </div>
  );
}






