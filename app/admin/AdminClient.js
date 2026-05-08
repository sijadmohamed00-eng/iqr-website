"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, isAdmin, signOut, getAllSubscribers, adminCreateSubscriber, extendSubscription, toggleSubscriber } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .rh{transition:background .15s}.rh:hover{background:rgba(26,79,196,.04)!important}
  .bh{transition:all .18s;cursor:pointer;border:none;font-family:'Cairo',font-weight:700}.bh:hover{transform:translateY(-1px);filter:brightness(1.1)}
  .fi input,.fi select{width:100%;font-family:'Cairo',sans-serif;font-size:13px;padding:10px 13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:7px;color:#f0f4ff;outline:none;transition:all .2s;}
  .fi input:focus,.fi select:focus{border-color:#1a4fc4;}
  .fi input::placeholder{color:rgba(240,244,255,.2);}
  .tab{transition:all .2s;cursor:pointer;border:none;font-family:'Cairo',font-weight:700}
  @media(max-width:768px){
    .adh{padding:14px 16px!important;flex-wrap:wrap!important;gap:10px!important}
    .adm{padding:16px!important}
    .st-grid{grid-template-columns:1fr!important}
    .fg{grid-template-columns:1fr!important}
    .hide-m{display:none!important}
    .adtable{font-size:11px!important}
    .adtable th,.adtable td{padding:8px 10px!important}
  }
`;

export default function AdminClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subs, setSubs] = useState([]);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ email:"", pass:"", rest:"", phone:"", city:"", months:"1" });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState({ total:0, active:0, expired:0 });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return; }
      const adm = await isAdmin(user.uid);
      if (!adm) { router.push("/"); return; }
      await loadSubs();
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadSubs = async () => {
    const data = await getAllSubscribers();
    setSubs(data);
    const now = new Date();
    setStats({
      total: data.length,
      active: data.filter(s => s.status === "active" && s.expiresAt?.toDate() > now).length,
      expired: data.filter(s => s.status !== "active" || !s.expiresAt || s.expiresAt.toDate() <= now).length,
    });
  };

  const createSub = async (e) => {
    e.preventDefault();
    setCreating(true); setMsg("");
    const { uid, error } = await adminCreateSubscriber({ email:form.email, password:form.pass, restaurant:form.rest, phone:form.phone, city:form.city, months:form.months });
    if (error) setMsg(`❌ ${error}`);
    else { setMsg(`✅ تم إنشاء حساب ${form.email} بنجاح!`); setForm({email:"",pass:"",rest:"",phone:"",city:"",months:"1"}); await loadSubs(); }
    setCreating(false);
  };

  const isActive = s => s.status === "active" && s.expiresAt?.toDate() > new Date();
  const daysLeft = s => s.expiresAt ? Math.max(0, Math.ceil((s.expiresAt.toDate() - new Date()) / 86400000)) : 0;

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000814"}}><div style={{fontFamily:"Cairo",fontSize:15,color:"rgba(240,244,255,.35)"}}>جاري التحميل...</div></div>;

  return (
    <>
      <style>{G}</style>
      <div style={{minHeight:"100vh",background:"#000814",direction:"rtl"}}>
        {/* HEADER */}
        <header className="adh" style={{background:"rgba(3,13,26,.97)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <a href="/" style={{fontFamily:"Space Mono",fontSize:17,fontWeight:700,color:"#f0f4ff",textDecoration:"none"}}>IQR</a>
            <div style={{height:16,width:1,background:"rgba(255,255,255,.1)"}}/>
            <span style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"#1a4fc4"}}>لوحة الأدمن</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <a href="/dashboard/" style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,padding:"6px 14px",background:"rgba(26,79,196,.1)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.2)",borderRadius:6,textDecoration:"none"}}>الداشبورد</a>
            <button className="bh" onClick={async()=>{await signOut();router.push("/login");}} style={{fontSize:12,padding:"6px 14px",background:"rgba(255,80,80,.08)",color:"#ff6b6b",border:"1px solid rgba(255,80,80,.18)",borderRadius:6}}>خروج</button>
          </div>
        </header>

        {/* STATS */}
        <div className="st-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,padding:"20px 28px 0"}}>
          {[{l:"إجمالي المشتركين",v:stats.total,c:"#1a4fc4",i:"👥"},{l:"اشتراكات نشطة",v:stats.active,c:"#00ff88",i:"✅"},{l:"منتهية/موقوفة",v:stats.expired,c:"#ffd60a",i:"⏰"}].map((s,i)=>(
            <div key={i} style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"18px 22px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:26}}>{s.i}</span>
              <div>
                <div style={{fontFamily:"Space Mono",fontSize:26,fontWeight:700,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)"}}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{padding:"18px 28px 0",display:"flex",gap:3,borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          {[{id:"list",l:"المشتركون"},{id:"create",l:"إنشاء حساب جديد"}].map(t=>(
            <button key={t.id} className="tab" onClick={()=>setTab(t.id)} style={{fontSize:13,padding:"9px 18px",borderRadius:"8px 8px 0 0",background:tab===t.id?"#0a1628":"transparent",color:tab===t.id?"#f0f4ff":"rgba(240,244,255,.4)",borderBottom:tab===t.id?"2px solid #1a4fc4":"2px solid transparent"}}>
              {t.l}
            </button>
          ))}
        </div>

        <main className="adm" style={{padding:"20px 28px"}}>
          {/* LIST */}
          {tab === "list" && (
            <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,color:"#f0f4ff"}}>قائمة المشتركين</h3>
                <button className="bh" onClick={loadSubs} style={{fontSize:11,padding:"5px 12px",background:"rgba(26,79,196,.1)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.2)",borderRadius:5}}>🔄 تحديث</button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table className="adtable" style={{width:"100%",borderCollapse:"collapse",direction:"rtl"}}>
                  <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                    {["الإيميل","المطعم","الهاتف","المدينة","ينتهي","الحالة","إجراءات"].map(h=>(
                      <th key={h} style={{padding:"11px 14px",fontSize:10,fontWeight:700,color:"rgba(240,244,255,.3)",textAlign:"right",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {subs.length === 0 ? (
                      <tr><td colSpan={7} style={{padding:"36px",textAlign:"center",color:"rgba(240,244,255,.2)",fontFamily:"Cairo",fontSize:13}}>لا يوجد مشتركون بعد</td></tr>
                    ) : subs.map(s => {
                      const act = isActive(s);
                      const days = daysLeft(s);
                      return (
                        <tr key={s.id} className="rh" style={{borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                          <td style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:11,color:"#f0f4ff",direction:"ltr"}}>{s.email}</td>
                          <td style={{padding:"12px 14px",fontSize:12,color:"rgba(240,244,255,.7)"}}>{s.restaurant||"—"}</td>
                          <td className="hide-m" style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.5)",direction:"ltr"}}>{s.phone||"—"}</td>
                          <td className="hide-m" style={{padding:"12px 14px",fontSize:11,color:"rgba(240,244,255,.5)"}}>{s.city||"—"}</td>
                          <td style={{padding:"12px 14px",whiteSpace:"nowrap"}}>
                            <span style={{fontFamily:"Space Mono",fontSize:10,color:days<=7?"#ffd60a":"rgba(240,244,255,.45)"}}>
                              {days > 0 ? `${days} يوم` : "منتهي"}
                            </span>
                          </td>
                          <td style={{padding:"12px 14px"}}>
                            <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,color:act?"#00ff88":"#ff6b6b",background:act?"rgba(0,255,136,.1)":"rgba(255,80,80,.1)"}}>{act?"نشط":"منتهي"}</span>
                          </td>
                          <td style={{padding:"12px 14px"}}>
                            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                              <button className="bh" onClick={()=>extendSubscription(s.id,1).then(loadSubs)} style={{fontSize:10,padding:"4px 9px",background:"rgba(0,255,136,.08)",color:"#00ff88",border:"1px solid rgba(0,255,136,.2)",borderRadius:4}}>+شهر</button>
                              <button className="bh" onClick={()=>extendSubscription(s.id,3).then(loadSubs)} style={{fontSize:10,padding:"4px 9px",background:"rgba(26,79,196,.08)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.2)",borderRadius:4}}>+3</button>
                              <button className="bh" onClick={()=>toggleSubscriber(s.id,s.status).then(loadSubs)} style={{fontSize:10,padding:"4px 9px",background:act?"rgba(255,80,80,.08)":"rgba(0,195,255,.08)",color:act?"#ff6b6b":"#00c3ff",border:`1px solid ${act?"rgba(255,80,80,.2)":"rgba(0,195,255,.2)"}`,borderRadius:4}}>
                                {act?"إيقاف":"تفعيل"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CREATE */}
          {tab === "create" && (
            <div style={{maxWidth:560}}>
              <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"24px"}}>
                <h3 style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,color:"#f0f4ff",marginBottom:20}}>إنشاء مشترك جديد</h3>
                <form onSubmit={createSub} style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="fg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[{l:"الإيميل *",k:"email",t:"email",ph:"example@email.com"},{l:"كلمة المرور *",k:"pass",t:"password",ph:"باسورد قوي"},{l:"اسم المطعم",k:"rest",t:"text",ph:"مطعم الأصيل"},{l:"رقم الهاتف",k:"phone",t:"tel",ph:"07XXXXXXXXX"},{l:"المدينة",k:"city",t:"text",ph:"بغداد"}].map(f=>(
                      <div key={f.k} className="fi">
                        <label style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:5}}>{f.l}</label>
                        <input type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} required={f.l.includes("*")}/>
                      </div>
                    ))}
                    <div className="fi">
                      <label style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:5}}>مدة الاشتراك</label>
                      <select value={form.months} onChange={e=>setForm(p=>({...p,months:e.target.value}))} style={{width:"100%",fontFamily:"Cairo",fontSize:13,padding:"10px 13px",background:"#0a1628",border:"1px solid rgba(255,255,255,.08)",borderRadius:7,color:"#f0f4ff",outline:"none"}}>
                        <option value="1">شهر</option><option value="3">3 أشهر</option><option value="6">6 أشهر</option><option value="12">سنة</option>
                      </select>
                    </div>
                  </div>
                  {msg && <div style={{background:msg.includes("✅")?"rgba(0,255,136,.07)":"rgba(255,80,80,.07)",border:`1px solid ${msg.includes("✅")?"rgba(0,255,136,.2)":"rgba(255,80,80,.2)"}`,borderRadius:7,padding:"10px 14px"}}><span style={{fontFamily:"Cairo",fontSize:12,color:msg.includes("✅")?"#00ff88":"#ff6b6b"}}>{msg}</span></div>}
                  <button type="submit" disabled={creating} className="bh" style={{fontSize:13,padding:"12px",background:"#1a4fc4",color:"#fff",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 0 20px rgba(26,79,196,.3)"}}>
                    {creating?(<><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>جاري الإنشاء...</>):"✅ إنشاء الحساب والاشتراك"}
                  </button>
                </form>
              </div>
              <div style={{marginTop:14,background:"rgba(26,79,196,.06)",border:"1px solid rgba(26,79,196,.14)",borderRadius:10,padding:"18px 20px"}}>
                <div style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"#1a4fc4",marginBottom:8}}>📋 بعد الإنشاء</div>
                <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.5)",lineHeight:1.9}}>
                  1. أرسل للمشترك الإيميل وكلمة المرور عبر واتساب<br/>
                  2. رابط الدخول: <span style={{fontFamily:"Space Mono",color:"#00c3ff",direction:"ltr"}}>iqrhq.me/login</span><br/>
                  3. يدخل فيشوف المدونة والداشبورد تلقائياً
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
