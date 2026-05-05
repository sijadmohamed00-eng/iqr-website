"use client";
import { useState, useEffect, useRef } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  .card-hover{transition:transform .2s,box-shadow .2s}
  .card-hover:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(26,79,196,.15)!important}
  /* MOBILE */
  @media(max-width:768px){
    .about-nav{padding:14px 20px!important}
    .about-nav-links{display:none!important}
    .about-hero{padding:100px 20px 60px!important}
    .about-story{grid-template-columns:1fr!important;gap:40px!important;padding:60px 20px!important}
    .about-stats{grid-template-columns:1fr 1fr!important}
    .about-values{padding:60px 20px!important}
    .about-values-grid{grid-template-columns:1fr!important}
    .about-team{padding:60px 20px!important}
    .about-team-grid{grid-template-columns:1fr!important}
    .about-cta{padding:60px 20px!important}
    .about-footer{padding:24px 20px!important}
  }
`;

function useVis(ref) {
  const [v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:.1});
    if(ref.current)o.observe(ref.current);
    return()=>o.disconnect();
  },[]);
  return v;
}

function Nav() {
  const [s,setS]=useState(false);
  useEffect(()=>{const f=()=>setS(window.scrollY>60);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);
  return (
    <nav className="about-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:s?"rgba(0,8,20,.97)":"transparent",backdropFilter:s?"blur(24px)":"none",borderBottom:s?"1px solid rgba(26,79,196,.1)":"none",transition:"all .4s",direction:"rtl"}}>
      <a href="/" style={{fontFamily:"Space Mono",fontSize:18,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR<span style={{color:"#1a4fc4",fontSize:12,fontFamily:"Cairo",marginRight:6}}>لإدارة المطاعم</span>
      </a>
      <div className="about-nav-links" style={{display:"flex",gap:24,alignItems:"center"}}>
        {[{h:"/",l:"الرئيسية"},{h:"/about/",l:"من نحن"},{h:"/blog/",l:"المدونة"},{h:"/contact/",l:"تواصل"}].map(n=>(
          <a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:n.h==="/about/"?"#1a4fc4":"rgba(240,244,255,.5)",textDecoration:"none"}}>{n.l}</a>
        ))}
        <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"7px 16px",background:"rgba(205,127,50,.15)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.3)",borderRadius:6,textDecoration:"none"}}>🔑 اشترك</a>
      </div>
    </nav>
  );
}

export default function AboutClient() {
  const r1=useRef(null);const v1=useVis(r1);
  const r2=useRef(null);const v2=useVis(r2);
  const r3=useRef(null);const v3=useVis(r3);

  const values=[
    {icon:"🎯",title:"الدقة أولاً",desc:"كل قرار مبني على بيانات حقيقية. نقيس كل شيء لنحسّن كل شيء."},
    {icon:"⚡",title:"السرعة في التنفيذ",desc:"نطبق، نقيس، نطور — بسرعة ودقة. لا خطط طويلة بلا نتائج."},
    {icon:"🤝",title:"شراكة حقيقية",desc:"لسنا موردين خدمة، نحن شريك استراتيجي. نجاحك هو نجاحنا."},
    {icon:"🔄",title:"التحسين المستمر",desc:"المطعم الناجح لا يتوقف عن التطور. نتابع معك شهرياً."},
  ];
  const stats=[{n:"+35%",l:"زيادة الأرباح",c:"#1a4fc4"},{n:"-28%",l:"تراجع الهدر",c:"#ffd60a"},{n:"3x",l:"سرعة الطلبات",c:"#00c3ff"},{n:"99%",l:"رضا العملاء",c:"#00ff88"}];
  const team=[
    {name:"فريق العمليات",role:"خبراء إدارة المطاعم",desc:"خبرة تتجاوز 10 سنوات في إدارة المطاعم في العراق والمنطقة.",avatar:"⚙️"},
    {name:"فريق التحليل",role:"محللو بيانات وأداء",desc:"متخصصون في تحليل بيانات المطاعم وتحويلها إلى قرارات ربحية.",avatar:"📊"},
    {name:"فريق التدريب",role:"مدربون معتمدون",desc:"يدربون فريقك حتى يصبح النظام طبيعياً يومياً بدون تدخل منك.",avatar:"🎓"},
  ];

  return (
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(26,79,196,.08),transparent 70%)",top:"-10%",right:"-5%",animation:"orb 15s ease-in-out infinite",filter:"blur(60px)"}}/>
      </div>
      <Nav/>

      <section className="about-hero" style={{minHeight:"65vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 48px 80px",textAlign:"center",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{maxWidth:800,animation:"fadeUp 1s ease both"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".4em",color:"#1a4fc4",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:14,fontFamily:"Cairo"}}>
            <span style={{flex:1,maxWidth:50,height:1,background:"linear-gradient(to right,transparent,#1a4fc4)"}}/>من نحن
            <span style={{flex:1,maxWidth:50,height:1,background:"linear-gradient(to left,transparent,#1a4fc4)"}}/>
          </div>
          <h1 style={{fontFamily:"Cairo",fontSize:"clamp(36px,6vw,80px)",fontWeight:900,lineHeight:.95,marginBottom:24,color:"#f0f4ff"}}>
            نحن لا نبيع<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>خدمة</em><br/>نبني <em style={{fontStyle:"normal",color:"rgba(240,244,255,.2)"}}>مستقبل</em>
          </h1>
          <p style={{fontFamily:"Cairo",fontSize:"clamp(15px,2vw,18px)",color:"rgba(240,244,255,.5)",lineHeight:1.9,maxWidth:580,margin:"0 auto"}}>
            IQR وُلدت من تجربة مباشرة مع مشاكل المطاعم في العراق — رأينا كيف تخسر المطاعم الجيدة بسبب غياب الأنظمة، فقررنا أن نكون الحل.
          </p>
        </div>
      </section>

      <section ref={r1} className="about-story" style={{padding:"80px 48px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
        <div style={{opacity:v1?1:0,transform:v1?"none":"translateY(40px)",transition:"all 1s ease"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:".4em",color:"#1a4fc4",marginBottom:16,fontFamily:"Cairo",display:"flex",alignItems:"center",gap:10}}>
            <span style={{width:24,height:1,background:"#1a4fc4"}}/>قصتنا
          </div>
          <h2 style={{fontFamily:"Cairo",fontSize:"clamp(24px,4vw,48px)",fontWeight:900,lineHeight:1,marginBottom:20,color:"#f0f4ff"}}>
            من مشكلة حقيقية<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>إلى حل حقيقي</em>
          </h2>
          <p style={{fontFamily:"Cairo",fontSize:"clamp(14px,1.8vw,16px)",color:"rgba(240,244,255,.45)",lineHeight:1.9,marginBottom:16}}>بدأت IQR عندما رأى مؤسسوها مطاعم جيدة تغلق أبوابها — لا بسبب سوء الطعام، بل بسبب الفوضى التشغيلية وغياب الأنظمة.</p>
          <p style={{fontFamily:"Cairo",fontSize:"clamp(14px,1.8vw,16px)",color:"rgba(240,244,255,.45)",lineHeight:1.9}}>قضينا أكثر من سنة ندرس أسباب فشل ونجاح المطاعم في العراق. النتيجة؟ نظام مبني على الواقع العراقي.</p>
        </div>
        <div className="about-stats" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,opacity:v1?1:0,transform:v1?"none":"translateX(40px)",transition:"all 1s ease .2s"}}>
          {stats.map((s,i)=>(
            <div key={i} className="card-hover" style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"28px 20px",textAlign:"center"}}>
              <div style={{fontFamily:"Space Mono",fontSize:"clamp(24px,3vw,36px)",fontWeight:700,color:s.c,marginBottom:8}}>{s.n}</div>
              <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)",fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={r2} className="about-values" style={{padding:"80px 48px",background:"#000510",position:"relative",zIndex:2}}>
        <div style={{maxWidth:1200,margin:"0 auto",direction:"rtl"}}>
          <div style={{textAlign:"center",marginBottom:56,opacity:v2?1:0,transform:v2?"none":"translateY(30px)",transition:"all .8s ease"}}>
            <h2 style={{fontFamily:"Cairo",fontSize:"clamp(24px,4vw,52px)",fontWeight:900,color:"#f0f4ff",lineHeight:1}}>
              ما الذي يحركنا<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>كل يوم</em>
            </h2>
          </div>
          <div className="about-values-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:3}}>
            {values.map((v,i)=>(
              <div key={i} className="card-hover" style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"36px 28px",opacity:v2?1:0,transform:v2?"none":"translateY(30px)",transition:`all .8s ease ${i*.1}s`}}>
                <span style={{fontSize:32,marginBottom:16,display:"block"}}>{v.icon}</span>
                <h3 style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,marginBottom:10,color:"#f0f4ff"}}>{v.title}</h3>
                <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.4)",lineHeight:1.8}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={r3} className="about-team" style={{padding:"80px 48px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{textAlign:"center",marginBottom:56,opacity:v3?1:0,transform:v3?"none":"translateY(30px)",transition:"all .8s ease"}}>
          <h2 style={{fontFamily:"Cairo",fontSize:"clamp(24px,4vw,52px)",fontWeight:900,color:"#f0f4ff",lineHeight:1}}>
            من يقف خلف<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>IQR</em>
          </h2>
        </div>
        <div className="about-team-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {team.map((t,i)=>(
            <div key={i} className="card-hover" style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"36px 28px",textAlign:"center",opacity:v3?1:0,transform:v3?"none":"translateY(30px)",transition:`all .8s ease ${i*.12}s`}}>
              <div style={{width:64,height:64,borderRadius:14,background:"rgba(26,79,196,.1)",border:"1px solid rgba(26,79,196,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px"}}>{t.avatar}</div>
              <h3 style={{fontFamily:"Cairo",fontSize:17,fontWeight:900,color:"#f0f4ff",marginBottom:5}}>{t.name}</h3>
              <div style={{fontFamily:"Cairo",fontSize:12,color:"#1a4fc4",fontWeight:700,marginBottom:12}}>{t.role}</div>
              <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.4)",lineHeight:1.8}}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta" style={{padding:"100px 48px",textAlign:"center",background:"#000510",position:"relative",zIndex:2}}>
        <div style={{maxWidth:560,margin:"0 auto",direction:"rtl"}}>
          <h2 style={{fontFamily:"Cairo",fontSize:"clamp(28px,5vw,56px)",fontWeight:900,lineHeight:.95,marginBottom:20,color:"#f0f4ff"}}>جاهز تبدأ<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>معنا؟</em></h2>
          <p style={{fontFamily:"Cairo",fontSize:15,color:"rgba(240,244,255,.45)",marginBottom:36,lineHeight:1.8}}>محادثة مجانية — بدون التزام</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://wa.me/9647734383431" target="_blank" style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"14px 36px",background:"#1a4fc4",color:"#fff",borderRadius:6,textDecoration:"none",boxShadow:"0 0 30px rgba(26,79,196,.4)"}}>📲 واتساب</a>
            <a href="/contact/" style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"13px 32px",background:"transparent",color:"rgba(240,244,255,.6)",border:"1px solid rgba(255,255,255,.1)",borderRadius:6,textDecoration:"none"}}>راسلنا</a>
          </div>
        </div>
      </section>

      <footer className="about-footer" style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"28px 48px",textAlign:"center",position:"relative",zIndex:2}}>
        <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
