// lib/supabase.js
// ══════════════════════════════════════════════════════════
// ضع هنا بيانات مشروعك من Supabase Dashboard
// Settings → API → Project URL & anon key
// ══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ══════════════════════════════════════════════════════════
// AUTH HELPERS
// ══════════════════════════════════════════════════════════

// تسجيل دخول
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// تسجيل خروج
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// الحصول على المستخدم الحالي
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// الحصول على الجلسة الحالية
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// التحقق من صلاحية الاشتراك
export async function checkSubscription(userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  return { subscribed: !!data && !error, data };
}

// التحقق من صلاحية الأدمن
export async function checkAdmin(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'admin';
}

// إنشاء مشترك جديد (يستخدمه الأدمن)
export async function createSubscriber(email, password, months = 1) {
  // 1. إنشاء حساب
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) return { error: authError };

  // 2. إضافة اشتراك
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + months);

  const { error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: authData.user.id,
      plan: 'bronze',
      status: 'active',
      expires_at: expiresAt.toISOString(),
    });

  return { data: authData, error: subError };
}
