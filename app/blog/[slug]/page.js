// تأكد من عدم وجود "use client" في الأعلى

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
  return (
    <div style={{
      backgroundColor: '#000814',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      direction: 'rtl'
    }}>
      <h1>مقال: {params.slug}</h1>
      <p>براند IQRHQ - قيد التطوير</p>
      <a href="/" style={{color: '#ff2d7a', marginTop: '20px'}}>العودة للرئيسية</a>
    </div>
  );
}
