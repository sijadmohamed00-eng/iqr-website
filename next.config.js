/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل التصدير الثابت للملفات
  output: 'export',
  // ضمان عمل الروابط مثل /dashboard/ بشكل صحيح
  trailingSlash: true,
  // إضافة إعدادات إضافية إذا لزم الأمر مستقبلاً
  reactStrictMode: true,
};

module.exports = nextConfig;
