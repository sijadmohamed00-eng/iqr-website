"use client";
import { useState, useEffect } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  .field input,.field textarea,.field select{width:100%;font-family:'Cairo',sans-serif;font-size:14px;padding:12px 15px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#f0f4ff;outline:none;transition:all .2s;}
  .field input:focus,.field textarea:focus,.field select:focus{border-color:#1a4fc4;box-shadow:0 0 0 3px rgba(26,79,196,.1);}
  .field input::placeholder,.field textarea::placeholder{color:rgba(240,244,255,.2);}
  .ch{transition:transform .2s,box-shadow .2s}.ch:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(26,79,196,.15)!important}
  @media(max-width:768px){
    .ct-nav{padding:14px 20px!important}
    .ct-nav-links{display:none!important}
    .ct-hero{padding:90px 20px 40px!important}
    .ct-hero h1{font-size:clamp(28px,7vw,56px)!important}
    .ct-grid{grid-template-columns:1fr!important;padding:0 20px 60px!important;gap:24px!important}
    .ct-footer{padding:24px 20px!important}
  }
`;

function Nav() {
  const [s,setS]=useState(false);
  useEffect(()=>{const f=()=>setS(window.scrollY>60);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);
  return (
    <nav className="ct-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:s?"rgba(0,8,20,.97)":"transparent",backdropFilter:s?"blur(20px)":"none",borderBottom:s?"1px solid rgba(26,79,196,.1)":"none",transition:"all .4s",direction:"rtl"}}>
      <a href="/" style={{fontFamily:"Space Mono",fontSize:18,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR
      </a>
      <div className="ct-nav-links" style={{display:"flex",gap:24,alignItems:"center"}}>
        {[{h:"/",l:"الرئيسية"},{h:"/about/",l:"من نحن"},{h:"/blog/",l:"المدونة"},{h:"/contact/",l:"تواصل"}].map(n=>(
          <a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:n.h==="/contact/"?"#1a4fc4":"rgba(240,244,255,.5)",textDecoration:"none"}}>{n.l}</a>
        ))}
        <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"7px 16px",background:"rgba(205,127,50,.15)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.3)",borderRadius:6,textDecoration:"none"}}>🔑 اشترك</a>
      </div>
    </nav>
  );
}

export default function ContactClient() {
  const [form,setForm]=useState({name:"",phone:"",city:"",type:"",message:""});
  const [sent,setSent]=useState(false);

  const submit=(e)=>{
    e.preventDefault();
    const msg=`مرحبا IQR،%0aالاسم: ${form.name}%0aالهاتف: ${form.phone}%0aالمدينة: ${form.city||"غير محدد"}%0aنوع المطعم: ${form.type||"غير محدد"}%0aرسالة: ${form.message||"لا توجد رسالة"}`;
    window.open(`https://wa.me/9647734383431?text=${msg}`,"_blank");
    setSent(true);
  };

  const channels=[
    {icon:"📱",label:"واتساب",val:"07734383431",link:"https://wa.me/9647734383431",color:"#25D366",bg:"rgba(37,211,102,.07)"},
    {icon:"📧",label:"البريد الإلكتروني",val:"info@iqrhq.me",link:"mailto:info@iqrhq.me",color:"#00c3ff",bg:"rgba(0,195,255,.07)"},
    {icon:"📸",label:"إنستاغرام",val:"@iqrhq_ops",link:"https://instagram.com/iqrhq_ops",color:"#E1306C",bg:"rgba(225,48,108,.07)"},
  ];

  return (
    <>
      <style>{G}</style>
      <Nav/>
      <section className="ct-hero" style={{minHeight:"45vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"110px 48px 48px",textAlign:"center",position:"relative",zIndex:2,direction:"rtl",animation:"fadeUp .9s ease both"}}>
        <div style={{maxWidth:640}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".4em",color:"#1a4fc4",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"Cairo"}}>
            <span style={{flex:1,maxWidth:40,height:1,background:"linear-gradient(to right,transparent,#1a4fc4)"}}/>تواصل معنا
            <span style={{flex:1,maxWidth:40,height:1,background:"linear-gradient(to left,transparent,#1a4fc4)"}}/>
          </div>
          <h1 style={{fontFamily:"Cairo",fontWeight:900,lineHeight:.95,marginBottom:16,color:"#f0f4ff"}}>
            نبدأ بـ<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>محادثة مجانية</em>
          </h1>
          <p style={{fontFamily:"Cairo",fontSize:15,color:"rgba(240,244,255,.45)",lineHeight:1.8}}>بدون التزام — نفهم وضع مطعمك ونحدد كيف نساعدك</p>
        </div>
      </section>

      <section style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div className="ct-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,padding:"0 48px 80px",alignItems:"start"}}>
          {/* FORM */}
          <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:"36px"}}>
            <h2 style={{fontFamily:"Cairo",fontSize:20,fontWeight:900,color:"#f0f4ff",marginBottom:6}}>أرسل لنا رسالة</h2>
            <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.35)",marginBottom:28}}>سنرد عليك خلال ساعات</p>
            {sent?(
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{fontSize:40,marginBottom:14}}>✅</div>
                <h3 style={{fontFamily:"Cairo",fontSize:20,fontWeight:900,color:"#00ff88",marginBottom:10}}>تم الإرسال!</h3>
                <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.45)"}}>سنتواصل معك قريباً</p>
              </div>
            ):(
              <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:14}}>
                {[{l:"الاسم *",k:"name",t:"text",ph:"اسمك"},{l:"الهاتف *",k:"phone",t:"tel",ph:"07XXXXXXXXX"},{l:"المدينة",k:"city",t:"text",ph:"بغداد..."}].map(f=>(
                  <div key={f.k} className="field">
                    <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.4)",display:"block",marginBottom:6}}>{f.l}</label>
                    <input required={f.l.includes("*")} type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}/>
                  </div>
                ))}
                <div className="field">
                  <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.4)",display:"block",marginBottom:6}}>نوع المطعم</label>
                  <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:"100%",fontFamily:"Cairo",fontSize:14,padding:"12px 15px",background:"#0a1628",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,color:"#f0f4ff",outline:"none"}}>
                    <option value="">اختر...</option>
                    {["مطعم عائلي","فاست فود","مطعم فاخر","سلسلة مطاعم","كافيه","غيره"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.4)",display:"block",marginBottom:6}}>رسالتك</label>
                  <textarea placeholder="أخبرنا عن مطعمك..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={4} style={{resize:"vertical"}}/>
                </div>
                <button type="submit" style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"13px",borderRadius:8,border:"none",background:"#1a4fc4",color:"#fff",cursor:"pointer",boxShadow:"0 0 24px rgba(26,79,196,.3)"}}>
                  📩 إرسال الرسالة
                </button>
              </form>
            )}
          </div>

          {/* CHANNELS */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <h2 style={{fontFamily:"Cairo",fontSize:20,fontWeight:900,color:"#f0f4ff",marginBottom:4}}>أو تواصل مباشرة</h2>
            <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.35)",marginBottom:8}}>نرد على واتساب خلال دقائق</p>
            {channels.map((c,i)=>(
              <a key={i} href={c.link} target="_blank" className="ch" style={{display:"flex",alignItems:"center",gap:14,background:c.bg,border:`1px solid ${c.color}40`,borderRadius:12,padding:"18px 22px",textDecoration:"none"}}>
                <div style={{width:44,height:44,borderRadius:10,background:`${c.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{c.icon}</div>
                <div>
                  <div style={{fontFamily:"Cairo",fontSize:11,color:c.color,fontWeight:700,marginBottom:3}}>{c.label}</div>
                  <div style={{fontFamily:"Space Mono",fontSize:13,fontWeight:700,color:"#f0f4ff",direction:"ltr"}}>{c.val}</div>
                </div>
              </a>
            ))}
            <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"20px",marginTop:4}}>
              <h3 style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,color:"#f0f4ff",marginBottom:14}}>⏰ أوقات العمل</h3>
              {[{d:"السبت — الخميس",t:"9:00 ص — 10:00 م"},{d:"الجمعة",t:"2:00 م — 10:00 م"}].map(h=>(
                <div key={h.d} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.5)"}}>{h.d}</span>
                  <span style={{fontFamily:"Space Mono",fontSize:11,color:"#00ff88"}}>{h.t}</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:"9px 12px",background:"rgba(0,255,136,.06)",border:"1px solid rgba(0,255,136,.15)",borderRadius:6}}>
                <span style={{fontFamily:"Cairo",fontSize:11,color:"#00ff88",fontWeight:700}}>✅ واتساب متاح على مدار الساعة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="ct-footer" style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"28px 48px",textAlign:"center"}}>
        <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
