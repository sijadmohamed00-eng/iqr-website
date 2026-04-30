export const metadata = {
  title: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
  description: "نحول فوضى مطعمك إلى دقة هندسية ذاتية — نظام متكامل لإدارة الطلبات، المخزون، الموظفين، والتحليلات في العراق.",
  keywords: ["إدارة مطاعم العراق", "نظام مطاعم", "تطوير مطاعم بغداد", "iqr", "إدارة مطعم", "نظام كاشير عراق"],
  authors: [{ name: "IQR", url: "https://iqrhq.me" }],
  metadataBase: new URL("https://iqrhq.me"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "IQR | الشركة الأولى لإدارة وتطوير المطاعم في العراق",
    description: "نحول فوضى مطعمك إلى دقة هندسية ذاتية — نظام متكامل لإدارة المطاعم في العراق",
    url: "https://iqrhq.me",
    siteName: "IQR",
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IQR | إدارة وتطوير المطاعم في العراق",
    description: "نحول فوضى مطعمك إلى دقة هندسية ذاتية",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#000814" }}>
        {children}
      </body>
    </html>
  );
}
