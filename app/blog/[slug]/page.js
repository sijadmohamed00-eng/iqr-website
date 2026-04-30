export async function generateStaticParams() {
  const slugs = [
    "inventory-waste",
    "peak-hours",
    "staff-management",
    "menu-engineering",
    "order-routing",
    "iraq-restaurant-market"
  ];

  return slugs.map((slug) => ({
    slug: slug,
  }));
}
