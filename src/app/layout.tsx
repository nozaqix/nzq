import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "NZQ",
  description: "コンポーザーnozaqiのポートフォリオwebサイトです。作品紹介や技術実験、思考のアウトプットなどを載せています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Script
          id="domain-redirect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const hostname = window.location.hostname;
                  if (hostname === 'nzq.pages.dev' || hostname.startsWith('nzq.pages.dev')) {
                    const newUrl = 'https://nozaqi.work' + window.location.pathname + window.location.search + window.location.hash;
                    
                    // SEO対応: meta refreshタグを追加（クローラー用）
                    if (document.head) {
                      const metaRefresh = document.createElement('meta');
                      metaRefresh.httpEquiv = 'refresh';
                      metaRefresh.content = '0;url=' + newUrl;
                      document.head.appendChild(metaRefresh);
                    }
                    
                    // 即座にリダイレクト（ブラウザ用）
                    window.location.replace(newUrl);
                  }
                }
              })();
            `,
          }}
        />
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rtjm6kfq1m");
            `,
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-800CEQKZCD"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-800CEQKZCD');
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}

