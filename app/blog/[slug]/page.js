// app/blog/[slug]/page.js

export async function generateStaticParams() {
  return [
    { slug: "inventory-waste" },
    { slug: "peak-hours" },
    { slug: "staff-management" },
    { slug: "menu-engineering" },
    { slug: "order-routing" },
    { slug: "iraq-restaurant-market" }
  ];
}

export default function Page({ params }) {
  const BlogPostClient = require("./BlogPostClient").default;
  return <BlogPostClient params={params} />;
}
