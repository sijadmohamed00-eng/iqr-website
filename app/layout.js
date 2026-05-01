export const metadata = {
  title: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
  description: "نحول فوضى مطعمك إلى دقة هندسية ذاتية — نظام متكامل لإدارة الطلبات، المخزون، الموظفين، والتحليلات في العراق.",
  keywords: ["إدارة مطاعم العراق", "نظام مطاعم", "تطوير مطاعم بغداد", "iqr", "إدارة مطعم", "نظام كاشير عراق"],
  authors: [{ name: "IQR", url: "https://iqrhq.me" }],
  metadataBase: new URL("https://iqrhq.me"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IQR",
  },
  openGraph: {
    title: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
    description: "نحول فوضى مطعمك إلى دقة هندسية ذاتية — نظام متكامل لإدارة المطاعم في العراق",
    url: "https://iqrhq.me",
    siteName: "IQR",
    locale: "ar_IQ",
    type: "website",
    images: [{ url: "/icon-512x512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IQR | إدارة وتطوير المطاعم في العراق",
    description: "نحول فوضى مطعمك إلى دقة هندسية ذاتية",
    images: ["/icon-512x512.png"],
  },
  robots: { index: true, follow: true },
};

const themeScript = `document.documentElement.setAttribute('data-theme','dark');`;

const globalStyles = `
  :root[data-theme="dark"] {
    --bg-primary:    #000814;
    --bg-secondary:  #060e22;
    --bg-card:       rgba(10,20,50,0.6);
    --bg-glass:      rgba(10,31,92,0.4);
    --text-primary:  #f0f4ff;
    --text-secondary:rgba(240,244,255,0.5);
    --text-muted:    rgba(240,244,255,0.2);
    --accent:        #ff2d7a;
    --accent-glow:   rgba(255,45,122,0.2);
    --accent-soft:   rgba(255,45,122,0.08);
    --navy:          #0a1f5c;
    --navy-light:    #162a7a;
    --blue-accent:   #00c3ff;
    --blue-rgb:      0,195,255;
    --border:        rgba(255,255,255,0.07);
    --border-accent: rgba(255,45,122,0.3);
    --success:       #00e887;
    --warning:       #ffb800;
    color-scheme: dark;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Cairo', sans-serif;
    overflow-x: hidden;
    transition: background 0.35s ease, color 0.35s ease;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 99px; }
  ::selection { background: var(--accent-glow); color: var(--text-primary); }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="IQR" />
        <meta name="theme-color" content="#0a1f5c" />
        <meta name="msapplication-TileColor" content="#0a1f5c" />
        <meta name="msapplication-TileImage" content="/icon-144x144.png" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

        {/* Theme init - no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Global Design System */}
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
