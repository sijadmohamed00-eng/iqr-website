"use client";
import { useState, useEffect } from "react";
import { onAuthChange, checkSubscription } from "../lib/firebase";

export function useSubscription() {
  const [state, setState] = useState({ user: null, subscribed: false, checked: false });
  useEffect(() => {
    const unsub = onAuthChange(async (fbUser) => {
      if (fbUser) {
        const sub = await checkSubscription(fbUser.uid);
        setState({ user: fbUser, subscribed: sub, checked: true });
      } else {
        setState({ user: null, subscribed: false, checked: true });
      }
    });
    return () => unsub();
  }, []);
  return state;
}

const S = `
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes pulse-glow{0%,100%{box-shadow:0 0 24px rgba(205,127,50,.25)}50%{box-shadow:0 0 50px rgba(205,127,50,.55)}}
  .gb{transition:all .25s;cursor:pointer}.gb:hover{transform:translateY(-2px);filter:brightness(1.1);}
`;

export function BlogGate({ children }) {
  const { subscribed, checked } = useSubscription();
  if (!checked) return (
    <div style={{ minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.3)" }}>جاري التحميل...</div>
    </div>
  );
  if (subscribed) return <>{children}</>;
  return (
    <>
      <style>{S}</style>
      <div style={{ position: "relative" }}>
        <div style={{ maxHeight: 260, overflow: "hidden", position: "relative", pointerEvents: "none", userSelect: "none" }}>
          {children}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: "linear-gradient(to bottom,transparent,#000814)" }} />
        </div>
        <div style={{ marginTop: -32, background: "linear-gradient(135deg,#0a1628,#0d1f3d)", border: "1px solid rgba(205,127,50,.22)", borderRadius: 14, padding: "36px 32px", textAlign: "center", position: "relative", overflow: "hidden", animation: "pulse-glow 3s ease-in-out infinite" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right,#cd7f32,#f5c874,#cd7f32)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
          <div style={{ fontSize: 36, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🔑</div>
          <h3 style={{ fontFamily: "Cairo", fontSize: 20, fontWeight: 900, color: "#f0f4ff", marginBottom: 8 }}>المحتوى الكامل للمشتركين فقط</h3>
          <p style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.5)", lineHeight: 1.8, maxWidth: 420, margin: "0 auto 24px" }}>
            سجّل دخولك إذا عندك حساب، أو اشترك في الخطة البرونزية للوصول الكامل.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/login/" className="gb" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 900, padding: "12px 28px", background: "#1a4fc4", color: "#fff", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 24px rgba(26,79,196,.35)" }}>🔐 سجّل الدخول</a>
            <a href="/pricing/" className="gb" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 900, padding: "12px 24px", background: "linear-gradient(135deg,#cd7f32,#f5c874)", color: "#000", borderRadius: 8, textDecoration: "none" }}>اشترك — $100/شهر</a>
          </div>
        </div>
      </div>
    </>
  );
}

export function DashboardGate({ children }) {
  const { subscribed, checked } = useSubscription();
  if (!checked) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000814" }}>
      <div style={{ fontFamily: "Cairo", fontSize: 15, color: "rgba(240,244,255,.3)" }}>جاري التحقق...</div>
    </div>
  );
  if (subscribed) return <>{children}</>;
  return (
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000814", padding: "32px", direction: "rtl" }}>
        <div style={{ position: "fixed", inset: 0, filter: "blur(14px) brightness(0.22)", pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ background: "#0a1628", height: "100vh", display: "grid", gridTemplateColumns: "56px 1fr" }}>
            <div style={{ background: "#030d1a" }} />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[...Array(4)].map((_,i) => <div key={i} style={{ background: "#0a1628", height: 90, borderRadius: 10 }} />)}
              </div>
              <div style={{ background: "#0a1628", flex: 1, borderRadius: 10 }} />
            </div>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 460, width: "100%", textAlign: "center", background: "linear-gradient(135deg,#0a1628,#0d1f3d)", border: "1px solid rgba(205,127,50,.28)", borderRadius: 18, padding: "44px 36px", boxShadow: "0 40px 100px rgba(0,0,0,.6)", animation: "fadeUp .8s ease" }}>
          <div style={{ height: 2, background: "linear-gradient(to right,#cd7f32,#f5c874,#cd7f32)", borderRadius: "18px 18px 0 0", position: "absolute", top: 0, left: 0, right: 0, backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
          <div style={{ fontSize: 44, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🔐</div>
          <h2 style={{ fontFamily: "Cairo", fontSize: 24, fontWeight: 900, color: "#f0f4ff", marginBottom: 10 }}>الداشبورد للمشتركين فقط</h2>
          <p style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.5)", lineHeight: 1.8, marginBottom: 28 }}>
            لوحة التحكم الكاملة — إيرادات، طلبات، مخزون، موظفين. متاحة مع الخطة البرونزية.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="/login/" className="gb" style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 900, padding: "14px", background: "#1a4fc4", color: "#fff", borderRadius: 10, textDecoration: "none", boxShadow: "0 0 28px rgba(26,79,196,.4)" }}>🔐 سجّل الدخول</a>
            <a href="/pricing/" className="gb" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "13px", background: "linear-gradient(135deg,#cd7f32,#f5c874)", color: "#000", borderRadius: 10, textDecoration: "none" }}>اشترك الآن — $100/شهر 🚀</a>
            <a href="/" style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.3)", textDecoration: "none", padding: "8px" }}>← الرئيسية</a>
          </div>
        </div>
      </div>
    </>
  );
}
