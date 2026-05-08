import { AuthProvider } from "../lib/AuthContext";

export const metadata = {
  title: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
  description: "نحول فوضى مطعمك إلى دقة هندسية — نظام متكامل لإدارة المطاعم في العراق.",
  metadataBase: new URL("https://iqrhq.me"),
  openGraph: {
    title: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
    description: "نحول فوضى مطعمك إلى دقة هندسية — نظام متكامل لإدارة المطاعم في العراق.",
    url: "https://iqrhq.me",
    siteName: "IQR",
    locale: "ar_IQ",
    type: "website",
    images: [
      {
        url: "https://iqrhq.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IQR | إدارة المطاعم في العراق",
    description: "نحول فوضى مطعمك إلى دقة هندسية — نظام متكامل لإدارة المطاعم في العراق.",
    images: ["https://iqrhq.me/og-image.png"],
  },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

const css = `
  :root{--bg:#000814;--card:#0a1628;--accent:#1a4fc4;--accent2:#00c3ff;--text:#f0f4ff;--text2:rgba(240,244,255,.5);--bronze:#cd7f32;--border:rgba(255,255,255,.06);}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Cairo',sans-serif;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:var(--accent2);border-radius:99px}
  ::selection{background:rgba(26,79,196,.15)}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="theme-color" content="#0a1f5c"/>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
        <style dangerouslySetInnerHTML={{__html:css}}/>
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
