# دليل إعداد IQR v2 — خطوة بخطوة

## ما الجديد في هذا الإصدار
- ✅ نظام يوزر + باسورد حقيقي (بدل روابط)
- ✅ لوحة أدمن للتحكم في المشتركين
- ✅ ربط بـ Supabase (قاعدة بيانات + auth)
- ✅ Responsive كامل للموبايل والحاسوب
- ✅ مقال الكول سنتر المفصّل
- ✅ ترتيب المدونة: كول سنتر أول، مخزون آخر

---

## الخطوة 1: إنشاء مشروع Supabase

1. اذهب لـ **supabase.com** وأنشئ حساب مجاني
2. اضغط **New Project**
3. اختر اسماً للمشروع وكلمة مرور قوية
4. انتظر الإنشاء (دقيقتين)
5. من **Settings → API** احفظ:
   - `Project URL`
   - `anon public key`

---

## الخطوة 2: إعداد قاعدة البيانات

1. في Supabase اذهب لـ **SQL Editor**
2. افتح ملف `lib/supabase-setup.sql` من المشروع
3. الصق المحتوى كاملاً في المحرر
4. اضغط **Run**

---

## الخطوة 3: إنشاء حساب الأدمن

1. في Supabase اذهب لـ **Authentication → Users**
2. اضغط **Add User**
3. أدخل إيميلك وباسورد قوي
4. بعد الإنشاء، نفّذ في SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## الخطوة 4: إعداد ملف البيئة

انسخ ملف `.env.local.example` واسمه `.env.local`:

```bash
cp .env.local.example .env.local
```

افتح `.env.local` وضع بياناتك:

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com
```

---

## الخطوة 5: تشغيل المشروع

```bash
npm install
npm run dev
```

---

## الخطوة 6: رفع على Cloudflare Pages

1. في Cloudflare Pages → Environment Variables أضف:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
2. Build command: `npm run build`
3. Output: `out`

---

## كيف تضيف مشترك جديد

1. اذهب لـ `iqrhq.me/admin`
2. سجّل دخول بحساب الأدمن
3. اضغط تبويب **إنشاء مشترك جديد**
4. أدخل:
   - الإيميل وكلمة المرور
   - اسم المطعم، الهاتف، المدينة
   - مدة الاشتراك (شهر / 3 أشهر / 6 أشهر / سنة)
5. اضغط **إنشاء**
6. أرسل للمشترك عبر واتساب:
   - رابط الدخول: `iqrhq.me/login`
   - إيميله وكلمة مروره

---

## صلاحيات لوحة الأدمن

| الإجراء | الوصف |
|---------|-------|
| **+شهر** | يمدد الاشتراك شهراً إضافياً |
| **+3 أشهر** | يمدد الاشتراك 3 أشهر |
| **إيقاف** | يوقف الاشتراك فوراً |
| **تفعيل** | يعيد تفعيل اشتراك موقف |

---

## الصفحات والمسارات

| المسار | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/login/` | تسجيل الدخول |
| `/admin/` | لوحة الأدمن (أدمن فقط) |
| `/dashboard/` | الداشبورد (مشتركين فقط) |
| `/blog/` | المدونة |
| `/blog/call-center-setup/` | مقال الكول سنتر (مجاني) |
| `/pricing/` | صفحة الاشتراكات |
| `/checkout/` | صفحة الدفع |
| `/about/` | من نحن |
| `/contact/` | تواصل |
