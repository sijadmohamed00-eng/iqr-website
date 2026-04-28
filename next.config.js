/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // يحول المشروع إلى ملفات ثابتة (HTML/CSS/JS)
  images: {
    unoptimized: true,   // ضروري لتعمل الصور والأيقونات بدون سيرفر معالجة
  },
  // إذا كنت تستخدم Framer Motion أو Three.js، يفضل ترك الإعدادات الافتراضية أدناه
  reactStrictMode: true,
}

module.exports = nextConfig
