-- ══════════════════════════════════════════════════════════
-- IQR Supabase Setup — شغّل هذا في Supabase SQL Editor
-- ══════════════════════════════════════════════════════════

-- 1. جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'subscriber', -- 'admin' أو 'subscriber'
  restaurant_name TEXT,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول الاشتراكات
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan TEXT DEFAULT 'bronze',
  status TEXT DEFAULT 'active', -- 'active' أو 'expired' أو 'cancelled'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. تفعيل Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Policies للـ profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Policies للـ subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all subscriptions"
  ON subscriptions FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Function تلقائية لإنشاء profile عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'subscriber');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ══════════════════════════════════════════════════════════
-- بعد تشغيل السكريبت، أنشئ حساب الأدمن:
-- 1. اذهب لـ Authentication → Users → Add User
-- 2. أدخل إيميلك وباسورد قوي
-- 3. شغّل هذا الأمر مع الـ UUID مالتك:
--
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ══════════════════════════════════════════════════════════
