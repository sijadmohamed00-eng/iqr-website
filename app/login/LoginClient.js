"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../../lib/supabase";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif;min-height:100vh}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .field input{
    width:100%;font-family:'Cairo',sans-serif;font-size:15px;
    padding:14px 18px;background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.08);border-radius:10px;
    color:#f0f4ff;outline:none;transition:all .2s;
    direction:ltr;text-align:left;
  }
  .field input:focus{border-color:#1a4fc4;box-shadow:0 0 0 3px rgba(26,79,196,.12);}
  .field input::placeholder{color:rgba(240,244,255,.2);direction:rtl;text-align:right;}
  .login-btn{transition:all .25s ease;cursor:pointer;}
  .login-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 40px rgba(26,79,196,.5)!important;}
  .login-btn:disabled{opacity:.5;cursor:not-allowed;}

  /* MOBILE */
  @media(max-width:600px){
    .login-card{padding:32px 24px!important;margin:0 16px!important;}
    .login-logo{font-size:16px!important;}
  }
`;

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await signIn(email, password);

    if (authError) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    // Check if admin → redirect to admin panel
    // Otherwise → redirect to dashboard/blog
    const isAdminUser = data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (isAdminUser) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <style>{G}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(26,79,196,.1),transparent 70%)", top: "-10%", right: "-10%", animation: "orb 15s ease-in-out infinite", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,195,255,.06),transparent 70%)", bottom: "10%", left: "-5%", animation: "orb 20s ease-in-out infinite reverse", filter: "blur(80px)" }} />
      </div>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", zIndex: 1, direction: "rtl" }}>
        <div className="login-card" style={{ width: "100%", maxWidth: 440, background: "linear-gradient(135deg,#0a1628,#0d1f3d)", border: "1px solid rgba(26,79,196,.2)", borderRadius: 20, padding: "48px 40px", animation: "fadeUp .8s ease", position: "relative", overflow: "hidden" }}>

          {/* Top shimmer line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right,#1a4fc4,#00c3ff,#1a4fc4)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <a href="/" className="login-logo" style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#f0f4ff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, background: "#1a4fc4", borderRadius: "50%", animation: "blink 2s infinite" }} />
              IQR<span style={{ color: "#1a4fc4", fontSize: 14, fontFamily: "Cairo", marginRight: 6 }}>لإدارة المطاعم</span>
            </a>
            <div style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.35)", marginTop: 8 }}>
              سجّل دخولك للوصول للمحتوى
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div className="field">
              <label style={{ fontFamily: "Cairo", fontSize: 12, fontWeight: 700, color: "rgba(240,244,255,.4)", display: "block", marginBottom: 8 }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label style={{ fontFamily: "Cairo", fontSize: 12, fontWeight: 700, color: "rgba(240,244,255,.4)", display: "block", marginBottom: 8 }}>
                كلمة المرور
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(255,80,80,.08)", border: "1px solid rgba(255,80,80,.2)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontFamily: "Cairo", fontSize: 13, color: "#ff6b6b" }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                marginTop: 8, fontFamily: "Cairo", fontSize: 15, fontWeight: 900,
                padding: "15px", background: "#1a4fc4", color: "#fff",
                border: "none", borderRadius: 10, cursor: "pointer",
                boxShadow: "0 0 30px rgba(26,79,196,.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                  جاري الدخول...
                </>
              ) : "🔐 تسجيل الدخول"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "28px 0" }} />

          {/* Subscribe CTA */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.35)", marginBottom: 12 }}>
              ما عندك حساب؟
            </p>
            <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "11px 28px", background: "rgba(205,127,50,.12)", color: "#cd7f32", border: "1px solid rgba(205,127,50,.25)", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>
              🔑 اشترك بالخطة البرونزية
            </a>
          </div>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="/" style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.25)", textDecoration: "none" }}>
              ← العودة للرئيسية
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
