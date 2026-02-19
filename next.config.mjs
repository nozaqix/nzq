/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nozaqi.work',
      },
    ],
  },
  trailingSlash: true,
  // Cloudflare Pages互換性のため、webpack設定を調整
  webpack: (config, { isServer }) => {
    // サーバーサイドビルド時のみfsモジュールを使用
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;

