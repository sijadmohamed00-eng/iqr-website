"use client";
import { useState, useRef, useEffect } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#cd7f32;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes pulse{0%,100%{box-shadow:0 0 30px rgba(205,127,50,.3)}50%{box-shadow:0 0 60px rgba(205,127,50,.6)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
  .bc{animation:pulse 3s ease-in-out infinite;transition:transform .3s}
  .bc:hover{transform:translateY(-4px)}
  .ci{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04)}
  .ci:last-child{border-bottom:none}
  .gb{transition:all .25s;cursor:pointer}
  .gb:hover{transform:translateY(-2px);filter:brightness(1.1)}
  .fq{cursor:pointer;transition:background .2s}.fq:hover{background:rgba(255,255,255,.03)!important}
  @media(max-width:768px){
    .pr-nav{padding:14px 20px!important}
    .pr-nav-links{display:none!important}
    .pr-hero{padding:90px 20px 48px!important}
    .pr-hero h1{font-size:clamp(28px,7vw,56px)!important}
    .pr-card-inner{grid-template-columns:1fr!important}
    .pr-card-inner>div:first-child{border-left:none!important;border-bottom:1px solid rgba(255,255,255,.05)!important}
    .pr-card{margin:0 16px 20px!important}
    .pr-soon{grid-template-columns:1fr!important;padding:0 16px 60px!important}
    .pr-how{grid-template-columns:1fr!important;padding:48px 20px!important}
    .pr-faq{padding:48px 20px 80px!important}
    .pr-cta{padding:60px 20px!important}
    .pr-footer{padding:24px 20px!important}
  }
`;

function useVis(ref){const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);return v;}

function Nav(){
  const[s,setS]=useState(false);
  useEffect(()=>{const f=()=>setS(window.scrollY>60);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);
  return(
    <nav className="pr-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:s?"rgba(0,8,20,.97)":"transparent",backdropFilter:s?"blur(20px)":"none",borderBottom:s?"1px solid rgba(26,79,196,.1)":"none",transition:"all .4s",direction:"rtl"}}>
      <a href="/" style={{fontFamily:"Space Mono",fontSize:18,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR
      </a>
      <div className="pr-nav-links" style={{display:"flex",gap:22,alignItems:"center"}}>
        {[{h:"/",l:"الرئيسية"},{h:"/blog/",l:"المدونة"},{h:"/contact/",l:"تواصل"}].map(n=>(
          <a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:"rgba(240,244,255,.5)",textDecoration:"none"}}>{n.l}</a>
        ))}
        <a href="/login/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"7px 16px",background:"rgba(26,79,196,.12)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.25)",borderRadius:6,textDecoration:"none"}}>🔐 دخول</a>
      </div>
    </nav>
  );
}

function FAQ({q,a}){const[o,setO]=useState(false);return(
  <div className="fq" onClick={()=>setO(v=>!v)} style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:10,padding:"18px 22px",marginBottom:6}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,color:"#f0f4ff"}}>{q}</span>
      <span style={{color:"#cd7f32",fontSize:20,transition:"transform .2s",transform:o?"rotate(45deg)":"none"}}>+</span>
    </div>
    {o&&<p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.5)",lineHeight:1.8,marginTop:12}}>{a}</p>}
  </div>
);}

export default function PricingClient(){
  const r1=useRef(null);const v1=useVis(r1);
  const r2=useRef(null);const v2=useVis(r2);

  const features=[
    {icon:"📚",t:"وصول كامل لجميع مقالات المدونة",d:"10+ مقالات متخصصة تضاف أسبوعياً"},
    {icon:"📊",t:"لوحة التحكم التفاعلية (الداشبورد)",d:"طلبات، مخزون، موظفين، تحليلات — مباشر"},
    {icon:"📈",t:"تقارير الأداء الأسبوعية والشهرية",d:"إيرادات، هدر، ذروة، وأداء كل صنف"},
    {icon:"💡",t:"توصيات الذكاء الاصطناعي",d:"اقتراحات مبنية على بيانات حقيقية"},
    {icon:"📬",t:"النشرة الأسبوعية الحصرية",d:"مقال + نصيحة تشغيلية على واتساب"},
    {icon:"⚡",t:"أولوية في الردود عبر واتساب",d:"رد خلال ساعة خلال أوقات العمل"},
  ];

  return(
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(205,127,50,.06),transparent 70%)",top:"-15%",right:"-10%",animation:"orb 15s ease-in-out infinite",filter:"blur(80px)"}}/>
      </div>
      <Nav/>

      <section className="pr-hero" style={{minHeight:"55vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"130px 48px 70px",textAlign:"center",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{maxWidth:700,animation:"fadeUp 1s ease both"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(205,127,50,.1)",border:"1px solid rgba(205,127,50,.25)",borderRadius:99,padding:"7px 18px",marginBottom:28}}>
            <span style={{fontSize:14}}>🔑</span>
            <span style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"#cd7f32"}}>خطط الاشتراك</span>
          </div>
          <h1 style={{fontFamily:"Cairo",fontWeight:900,lineHeight:.95,marginBottom:20,color:"#f0f4ff"}}>
            ابدأ بـ<em style={{fontStyle:"normal",color:"#cd7f32"}}>المعرفة</em><br/><span style={{color:"rgba(240,244,255,.2)"}}>قبل الحل</span>
          </h1>
          <p style={{fontFamily:"Cairo",fontSize:"clamp(14px,2vw,17px)",color:"rgba(240,244,255,.5)",lineHeight:1.9,maxWidth:540,margin:"0 auto"}}>
            الخطة البرونزية تعطيك كل المعرفة التي يحتاجها مطعمك — مقالات + داشبورد + تحليلات.
          </p>
        </div>
      </section>

      <section style={{padding:"0 48px 80px",maxWidth:860,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div className="pr-card bc" style={{background:"linear-gradient(135deg,#0d1a2e,#12203a)",border:"1px solid rgba(205,127,50,.35)",borderRadius:20,overflow:"hidden",marginBottom:20}}>
          <div style={{height:3,background:"linear-gradient(to left,#cd7f32,#f5c874,#cd7f32)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
          <div style={{position:"absolute",top:20,left:20}}>
            <span style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,padding:"4px 12px",background:"rgba(205,127,50,.2)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.4)",borderRadius:99}}>⭐ الخطة البرونزية</span>
          </div>
          <div className="pr-card-inner" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,position:"relative"}}>
            <div style={{padding:"60px 44px",borderLeft:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{marginBottom:28}}>
                <div style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.4)",marginBottom:6}}>الاشتراك الشهري</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontFamily:"Space Mono",fontSize:"clamp(40px,5vw,52px)",fontWeight:700,color:"#cd7f32",lineHeight:1}}>$100</span>
                  <span style={{fontFamily:"Cairo",fontSize:14,color:"rgba(240,244,255,.35)"}}>/شهر</span>
                </div>
                <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)",marginTop:6}}>≈ 130,000 دينار عراقي</div>
              </div>
              <a href="/checkout/" className="gb" style={{display:"block",textAlign:"center",fontFamily:"Cairo",fontSize:15,fontWeight:900,padding:"16px 28px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:10,textDecoration:"none",marginBottom:14,boxShadow:"0 0 36px rgba(205,127,50,.4)"}}>
                اشترك الآن 🚀
              </a>
              <p style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)",textAlign:"center",lineHeight:1.7}}>ألغِ في أي وقت · بدون عقود<br/>تفعيل فوري بعد التأكيد</p>
              <div style={{height:1,background:"rgba(255,255,255,.05)",margin:"24px 0"}}/>
              <div style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.25)",marginBottom:10}}>غير مشمول:</div>
              {["زيارة ميدانية","استشارات مباشرة","تدريب الفريق","أنظمة مخصصة"].map((x,i)=>(
                <div key={i} className="ci" style={{opacity:.45}}>
                  <span style={{fontSize:12,color:"rgba(240,244,255,.3)",flexShrink:0}}>🔒</span>
                  <span style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.3)"}}>{x}</span>
                </div>
              ))}
              <a href="/contact/" style={{display:"block",textAlign:"center",fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"#1a4fc4",marginTop:14,textDecoration:"none"}}>تحتاج خدمات أشمل؟ ←</a>
            </div>
            <div style={{padding:"60px 44px"}}>
              <div style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"rgba(240,244,255,.4)",marginBottom:20}}>✅ ما يشمله الاشتراك</div>
              {features.map((f,i)=>(
                <div key={i} className="ci">
                  <span style={{fontSize:18,flexShrink:0,animation:`float ${2+i*.25}s ease-in-out infinite`}}>{f.icon}</span>
                  <div>
                    <div style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:"#f0f4ff",marginBottom:2}}>{f.t}</div>
                    <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.35)",lineHeight:1.6}}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div className="pr-soon" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{name:"الفضية",price:"بالتفاوض",icon:"🥈",color:"#a8a9ad",f:["كل ميزات البرونزية","استشارة شهرية","تقارير مخصصة"]},{name:"الذهبية",price:"بالتفاوض",icon:"🥇",color:"#ffd60a",f:["كل الميزات","حضور ميداني","تدريب الفريق"]}].map((p,i)=>(
            <div key={i} style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:14,padding:"24px",position:"relative",overflow:"hidden",opacity:.55}}>
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(2px)",zIndex:1,borderRadius:14}}>
                <span style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,color:"rgba(240,244,255,.5)",background:"rgba(0,8,20,.8)",padding:"8px 20px",borderRadius:99,border:"1px solid rgba(255,255,255,.08)"}}>🔜 قريباً</span>
              </div>
              <div style={{fontSize:26,marginBottom:8}}>{p.icon}</div>
              <h3 style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,color:p.color,marginBottom:3}}>الخطة {p.name}</h3>
              <div style={{fontFamily:"Space Mono",fontSize:12,color:"rgba(240,244,255,.3)",marginBottom:12}}>{p.price}</div>
              {p.f.map((x,j)=><div key={j} style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>✓ {x}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section ref={r1} style={{padding:"60px 48px",background:"#000510",position:"relative",zIndex:2}}>
        <div style={{maxWidth:860,margin:"0 auto",direction:"rtl"}}>
          <div style={{textAlign:"center",marginBottom:48,opacity:v1?1:0,transform:v1?"none":"translateY(20px)",transition:"all .8s"}}>
            <h2 style={{fontFamily:"Cairo",fontSize:"clamp(22px,4vw,44px)",fontWeight:900,color:"#f0f4ff"}}>كيف تبدأ<em style={{fontStyle:"normal",color:"#cd7f32"}}> خلال دقائق</em></h2>
          </div>
          <div className="pr-how" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3}}>
            {[{n:"01",icon:"🖊️",t:"ادفع وسجّل",d:"أكمل نموذج الدفع — بطاقة ماستركارد أو تحويل."},{n:"02",icon:"📲",t:"تأكيد واتساب",d:"نتواصل معك فوراً ونرسل بيانات حساب الدخول."},{n:"03",icon:"🚀",t:"وصول فوري",d:"تدخل بالإيميل والباسورد للمدونة والداشبورد مباشرة."}].map((s,i)=>(
              <div key={i} style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"32px 24px",textAlign:"center",opacity:v1?1:0,transform:v1?"none":"translateY(20px)",transition:`all .8s ease ${i*.1}s`}}>
                <div style={{fontFamily:"Space Mono",fontSize:10,color:"#cd7f32",letterSpacing:".25em",marginBottom:12}}>{s.n}</div>
                <div style={{fontSize:28,marginBottom:12}}>{s.icon}</div>
                <h3 style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,color:"#f0f4ff",marginBottom:8}}>{s.t}</h3>
                <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.45)",lineHeight:1.8}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={r2} className="pr-faq" style={{padding:"60px 48px 100px",maxWidth:720,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{textAlign:"center",marginBottom:40,opacity:v2?1:0,transition:"all .8s"}}>
          <h2 style={{fontFamily:"Cairo",fontSize:"clamp(22px,4vw,44px)",fontWeight:900,color:"#f0f4ff"}}>أسئلة <em style={{fontStyle:"normal",color:"#cd7f32"}}>شائعة</em></h2>
        </div>
        <div style={{opacity:v2?1:0,transition:"all .8s .2s"}}>
          {[
            {q:"كيف أصل للمحتوى بعد الاشتراك؟",a:"بعد الدفع، نرسل لك إيميل وكلمة مرور على واتساب. تدخل على iqrhq.me/login وتصل للمدونة والداشبورد فوراً."},
            {q:"هل يمكنني إلغاء الاشتراك؟",a:"نعم، ألغِ في أي وقت قبل تجديد الشهر القادم. ما في عقود أو التزامات."},
            {q:"ما طرق الدفع المتاحة؟",a:"ماستركارد، تحويل بنكي، أو كاش للعراق. نؤكد اشتراكك مباشرة بعد استلام الدفع."},
            {q:"هل الداشبورد يعمل مع بيانات مطعمي؟",a:"حالياً ببيانات تجريبية لمطعم عراقي نموذجي. ربط بياناتك الخاصة متاح في الخطط الأعلى."},
          ].map((f,i)=><FAQ key={i} q={f.q} a={f.a}/>)}
        </div>
      </section>

      {/* CTA */}
      <section className="pr-cta" style={{padding:"80px 48px",textAlign:"center",background:"#000510",position:"relative",zIndex:2}}>
        <div style={{maxWidth:500,margin:"0 auto",direction:"rtl"}}>
          <h2 style={{fontFamily:"Cairo",fontSize:"clamp(28px,5vw,56px)",fontWeight:900,lineHeight:.95,marginBottom:16,color:"#f0f4ff"}}>جاهز تبدأ؟<br/><em style={{fontStyle:"normal",color:"#cd7f32"}}>$100</em></h2>
          <p style={{fontFamily:"Cairo",fontSize:14,color:"rgba(240,244,255,.45)",marginBottom:32,lineHeight:1.8}}>شهري — ألغِ متى تريد — وصول فوري</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/checkout/" className="gb" style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,padding:"15px 40px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:8,textDecoration:"none",boxShadow:"0 0 36px rgba(205,127,50,.4)"}}>اشترك الآن</a>
            <a href="https://wa.me/9647734383431" target="_blank" style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"14px 28px",background:"transparent",color:"rgba(240,244,255,.6)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,textDecoration:"none"}}>📲 سؤال؟</a>
          </div>
        </div>
      </section>

      <footer className="pr-footer" style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"28px 48px",textAlign:"center"}}>
        <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
