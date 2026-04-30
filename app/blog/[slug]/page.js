import BlogPostClient, { SLUGS } from "./BlogPostClient";

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const titles = {
    "inventory-waste": "كيف تقلل هدر مطعمك 30% | IQR",
    "peak-hours": "ساعات الذروة وكيف تستعد | IQR",
    "staff-management": "إدارة موظفي المطعم | IQR",
    "menu-engineering": "هندسة قائمة الطعام | IQR",
    "order-routing": "توجيه الطلبات الذكي | IQR",
    "iraq-restaurant-market": "سوق المطاعم العراق 2026 | IQR",
  };
  return {
    title: titles[params.slug] || "مقال | IQR",
    description: "مقال من مدونة IQR لإدارة وتطوير المطاعم في العراق",
  };
}

export default function BlogPostPage({ params }) {
  return <BlogPostClient params={params} />;
}
