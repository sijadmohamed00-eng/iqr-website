// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ══════════════════════════════════════════════════════
// Firebase Config
// ══════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyDsILU-slDItgC1zTVEnSBXpaLWXG1EyQg",
  authDomain: "iqrhq1.firebaseapp.com",
  projectId: "iqrhq1",
  storageBucket: "iqrhq1.firebasestorage.app",
  messagingSenderId: "314752102263",
  appId: "1:314752102263:web:7891fdd2d6af0343ac3b72",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// ══════════════════════════════════════════════════════
// ADMIN CREDENTIALS — ثابتة في الكود
// ══════════════════════════════════════════════════════
export const ADMIN_EMAIL = "admin@iqrhq.me";
export const ADMIN_PASSWORD = "1999178";

// ══════════════════════════════════════════════════════
// AUTH HELPERS
// ══════════════════════════════════════════════════════

export async function signIn(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

export async function signOut() {
  await fbSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ══════════════════════════════════════════════════════
// USER / SUBSCRIPTION HELPERS
// ══════════════════════════════════════════════════════

export async function getUserData(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function isAdmin(uid) {
  const data = await getUserData(uid);
  return data?.role === "admin";
}

export async function checkSubscription(uid) {
  const data = await getUserData(uid);
  if (!data) return false;
  if (data.role === "admin") return true;
  if (data.status !== "active") return false;
  if (!data.expiresAt) return false;
  return data.expiresAt.toDate() > new Date();
}

// ══════════════════════════════════════════════════════
// ADMIN: CREATE SUBSCRIBER
// ══════════════════════════════════════════════════════

export async function adminCreateSubscriber({ email, password, restaurant, phone, city, months }) {
  try {
    // 1. Create Firebase Auth user
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;

    // 2. Calculate expiry
    const expires = new Date();
    expires.setMonth(expires.getMonth() + parseInt(months));

    // 3. Save to Firestore
    await setDoc(doc(db, "users", uid), {
      email,
      restaurant: restaurant || "",
      phone: phone || "",
      city: city || "",
      role: "subscriber",
      plan: "bronze",
      status: "active",
      expiresAt: expires,
      createdAt: serverTimestamp(),
    });

    return { uid, error: null };
  } catch (err) {
    return { uid: null, error: err.message };
  }
}

// ══════════════════════════════════════════════════════
// ADMIN: GET ALL SUBSCRIBERS
// ══════════════════════════════════════════════════════

export async function getAllSubscribers() {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(u => u.role !== "admin");
}

// ══════════════════════════════════════════════════════
// ADMIN: UPDATE SUBSCRIBER
// ══════════════════════════════════════════════════════

export async function updateSubscriber(uid, updates) {
  await updateDoc(doc(db, "users", uid), updates);
}

export async function extendSubscription(uid, months) {
  const data = await getUserData(uid);
  const base = data?.expiresAt?.toDate() > new Date()
    ? data.expiresAt.toDate()
    : new Date();
  base.setMonth(base.getMonth() + months);
  await updateDoc(doc(db, "users", uid), {
    expiresAt: base,
    status: "active",
  });
}

export async function toggleSubscriber(uid, currentStatus) {
  await updateDoc(doc(db, "users", uid), {
    status: currentStatus === "active" ? "cancelled" : "active",
  });
}

// ══════════════════════════════════════════════════════
// SETUP: Initialize admin account (run once)
// ══════════════════════════════════════════════════════
// هذه الدالة تُستخدم عند أول تشغيل لإنشاء حساب الأدمن
export async function setupAdminAccount() {
  try {
    const result = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    await setDoc(doc(db, "users", result.user.uid), {
      email: ADMIN_EMAIL,
      role: "admin",
      status: "active",
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    // Already exists — that's fine
    return { success: false, error: err.message };
  }
}
