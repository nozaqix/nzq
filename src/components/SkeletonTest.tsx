'use client';

export default function SkeletonTest() {
  return (
    <div className="w-full">
      <div className="max-w-2xl">
        <h2 className="text-sm text-[#B8B9BA] mb-4 font-bold">スケルトンスクリーン色確認（テスト用）</h2>
        <div className="w-full overflow-hidden" style={{ aspectRatio: '800 / 600', minHeight: '200px', backgroundColor: 'rgb(120 120 120 / 0.4)' }}>
          <div 
            className="w-full h-full animate-shimmer" 
            style={{ 
              background: 'linear-gradient(to right, rgb(120 120 120 / 0.3), rgb(120 120 120 / 0.5), rgb(120 120 120 / 0.3))',
              backgroundSize: '200% 100%'
            }}
          ></div>
        </div>
        <p className="text-xs text-[#B8B9BA] mt-2">色: rgb(120 120 120 / 0.4)</p>
      </div>
    </div>
  );
}

