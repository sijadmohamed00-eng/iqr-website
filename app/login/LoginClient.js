"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, ADMIN_EMAIL, setupAdminAccount } from "../../lib/firebase";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif;min-height:100vh}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fi input{width:100%;font-family:'Cairo',sans-serif;font-size:14px;padding:13px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:9px;color:#f0f4ff;outline:none;transition:all .2s;direction:ltr;text-align:left;}
  .fi input:focus{border-color:#1a4fc4;box-shadow:0 0 0 3px rgba(26,79,196,.1);}
  .fi input::placeholder{direction:rtl;text-align:right;color:rgba(240,244,255,.2);}
  .lb{transition:all .25s;cursor:pointer}.lb:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 36px rgba(26,79,196,.5)!important}
  .lb:disabled{opacity:.45;cursor:not-allowed}
  @media(max-width:480px){.lc{padding:28px 20px!important;margin:0 12px!important}}
`;

export default function LoginClient() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [setupDone,setSetupDone] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { user, error: err } = await signIn(email, pass);
    if (err) { setError("البريد الإلكتروني أو كلمة المرور غير صحيحة"); setLoading(false); return; }
    router.push(user.email === ADMIN_EMAIL ? "/admin" : "/dashboard");
  };

  const handleSetup = async () => {
    setLoading(true);
    const r = await setupAdminAccount();
    setSetupDone(true); setLoading(false);
    setError(r.success ? "✅ تم إنشاء حساب الأدمن — سجّل الدخول" : "حساب الأدمن موجود مسبقاً — سجّل الدخول مباشرة");
  };

  return (
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(26,79,196,.1),transparent 70%)",top:"-10%",right:"-10%",filter:"blur(60px)"}}/>
      </div>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",position:"relative",zIndex:1,direction:"rtl"}}>
        <div className="lc" style={{width:"100%",maxWidth:420,background:"linear-gradient(135deg,#0a1628,#0d1f3d)",border:"1px solid rgba(26,79,196,.18)",borderRadius:18,padding:"44px 36px",animation:"fadeUp .8s ease",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(to right,#1a4fc4,#00c3ff,#1a4fc4)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
          <div style={{textAlign:"center",marginBottom:32}}>
            <a href="/" style={{fontFamily:"Space Mono",fontSize:20,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
              <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR
            </a>
            <div style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.35)",marginTop:6}}>سجّل دخولك للوصول للمحتوى</div>
          </div>
          <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="fi">
              <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.4)",display:"block",marginBottom:6}}>البريد الإلكتروني</label>
              <input type="email" required placeholder="example@email.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
            </div>
            <div className="fi">
              <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.4)",display:"block",marginBottom:6}}>كلمة المرور</label>
              <input type="password" required placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} autoComplete="current-password"/>
            </div>
            {error && (
              <div style={{background:error.includes("✅")?"rgba(0,255,136,.07)":"rgba(255,80,80,.07)",border:`1px solid ${error.includes("✅")?"rgba(0,255,136,.2)":"rgba(255,80,80,.2)"}`,borderRadius:8,padding:"10px 14px"}}>
                <span style={{fontFamily:"Cairo",fontSize:12,color:error.includes("✅")?"#00ff88":"#ff6b6b"}}>{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading} className="lb" style={{marginTop:6,fontFamily:"Cairo",fontSize:14,fontWeight:900,padding:"14px",background:"#1a4fc4",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",boxShadow:"0 0 28px rgba(26,79,196,.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              {loading?(<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>جاري الدخول...</>):"🔐 تسجيل الدخول"}
            </button>
          </form>
          <div style={{height:1,background:"rgba(255,255,255,.06)",margin:"24px 0"}}/>
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.3)",marginBottom:12}}>ما عندك حساب؟</p>
            <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"10px 24px",background:"rgba(205,127,50,.1)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.22)",borderRadius:7,textDecoration:"none",display:"inline-block"}}>🔑 اشترك بالخطة البرونزية</a>
          </div>
          {!setupDone && (
            <div style={{marginTop:14,textAlign:"center"}}>
              <button onClick={handleSetup} disabled={loading} style={{fontFamily:"Cairo",fontSize:10,color:"rgba(240,244,255,.15)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>
                إعداد حساب الأدمن (أول مرة فقط)
              </button>
            </div>
          )}
          <div style={{textAlign:"center",marginTop:12}}>
            <a href="/" style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.2)",textDecoration:"none"}}>← الرئيسية</a>
          </div>
        </div>
      </div>
    </>
  );
}
