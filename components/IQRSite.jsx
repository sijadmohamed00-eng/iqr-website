"use client";
import { useState, useEffect, useRef } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .c3{transition:transform .3s,box-shadow .3s}.c3:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(26,79,196,.15)!important}
  .cn{transition:color .3s}.cn:hover{color:#f0f4ff!important}
  .cta{transition:all .25s}.cta:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(26,79,196,.5)!important}
  /* MOBILE */
  @media(max-width:900px){
    .site-nav{padding:14px 20px!important}
    .site-nav-links{display:none!important}
    .site-nav-mob{display:flex!important}
    .mob-menu{display:flex!important}
    .hero-sec{padding:100px 20px 80px!important}
    .hero-h1{font-size:clamp(32px,8vw,64px)!important}
    .hero-stats{gap:24px!important}
    .prob-grid{grid-template-columns:1fr!important;padding:60px 20px!important}
    .prob-h{padding:60px 20px 0!important}
    .svc-sec{padding:60px 20px!important}
    .svc-header{grid-template-columns:1fr!important;gap:20px!important}
    .svc-pillar-grid{grid-template-columns:1fr!important}
    .res-grid{grid-template-columns:1fr 1fr!important;padding:60px 20px!important}
    .res-h{padding:60px 20px 0!important}
    .cta-sec{padding:60px 20px!important}
    .site-footer{padding:40px 20px 28px!important}
    .footer-grid{grid-template-columns:1fr 1fr!important;gap:28px!important}
  }
  @media(max-width:480px){
    .hero-h1{font-size:28px!important}
    .hero-btns{flex-direction:column!important}
    .hero-btns a{text-align:center!important}
    .res-grid{grid-template-columns:1fr!important}
    .footer-grid{grid-template-columns:1fr!important}
  }
`;

function useVis(ref,t=.1){const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);return v;}

function Nav(){
  const[s,setS]=useState(false);
  const[mob,setMob]=useState(false);
  useEffect(()=>{const f=()=>setS(window.scrollY>60);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);
  const links=[{h:"#services",l:"الخدمات"},{h:"#problem",l:"لماذا IQR"},{h:"#results",l:"النتائج"},{h:"/blog/",l:"المدونة"},{h:"/about/",l:"من نحن"}];
  return(
    <>
      <nav className="site-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:s?"rgba(0,8,20,.97)":"rgba(0,8,20,.4)",backdropFilter:"blur(20px)",borderBottom:s?"1px solid rgba(26,79,196,.1)":"none",transition:"all .4s",direction:"rtl"}}>
        <a href="/" style={{fontFamily:"Space Mono",fontSize:18,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>
          IQR<span style={{color:"#1a4fc4",fontSize:11,fontFamily:"Cairo",marginRight:5,fontWeight:400}}>لإدارة المطاعم</span>
        </a>
        <div className="site-nav-links" style={{display:"flex",gap:24,alignItems:"center"}}>
          {links.map(n=>(<a key={n.h} href={n.h} className="cn" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:"rgba(240,244,255,.5)",textDecoration:"none"}}>{n.l}</a>))}
          <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"7px 16px",background:"rgba(205,127,50,.12)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.25)",borderRadius:5,textDecoration:"none"}}>🔑 اشترك</a>
          <a href="/contact/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"7px 16px",background:"#1a4fc4",color:"#fff",borderRadius:5,textDecoration:"none"}}>تواصل</a>
        </div>
        <button className="site-nav-mob" style={{display:"none",background:"none",border:"none",cursor:"pointer",flexDirection:"column",gap:5,padding:4}} onClick={()=>setMob(v=>!v)}>
          {[0,1,2].map(i=><span key={i} style={{width:22,height:2,background:"#f0f4ff",borderRadius:2,display:"block",transition:"all .3s",transform:mob&&i===0?"rotate(45deg) translateY(7px)":mob&&i===2?"rotate(-45deg) translateY(-7px)":"none",opacity:mob&&i===1?0:1}}/>)}
        </button>
      </nav>
      <div className="mob-menu" style={{display:"none",position:"fixed",top:56,left:0,right:0,zIndex:99,background:"rgba(0,8,20,.98)",borderBottom:"1px solid rgba(255,255,255,.07)",flexDirection:"column",padding:"18px 20px",gap:2,backdropFilter:"blur(20px)",transform:mob?"translateY(0)":"translateY(-16px)",opacity:mob?1:0,transition:"all .3s",pointerEvents:mob?"all":"none"}}>
        {links.map(n=>(<a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,color:"rgba(240,244,255,.7)",textDecoration:"none",padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{n.l}</a>))}
        <div style={{display:"flex",gap:10,paddingTop:12}}>
          <a href="/pricing/" style={{flex:1,fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"10px",background:"rgba(205,127,50,.12)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.2)",borderRadius:7,textDecoration:"none",textAlign:"center"}}>🔑 اشترك</a>
          <a href="/contact/" style={{flex:1,fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"10px",background:"#1a4fc4",color:"#fff",borderRadius:7,textDecoration:"none",textAlign:"center"}}>تواصل</a>
        </div>
      </div>
    </>
  );
}

function Hero(){
  return(
    <section className="hero-sec" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"140px 48px 100px",position:"relative",zIndex:2,direction:"rtl",textAlign:"center"}}>
      <div style={{maxWidth:860,animation:"fadeUp 1s ease both"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(26,79,196,.08)",border:"1px solid rgba(26,79,196,.2)",borderRadius:99,padding:"7px 18px",marginBottom:36,fontFamily:"Cairo",fontSize:12,color:"#1a4fc4",fontWeight:700}}>
          <span style={{width:5,height:5,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>
          الشركة الأولى لإدارة وتطوير المطاعم في العراق
        </div>
        <h1 className="hero-h1" style={{fontFamily:"Cairo",fontSize:"clamp(40px,7vw,88px)",fontWeight:900,lineHeight:.92,letterSpacing:"-.02em",marginBottom:28,color:"#f0f4ff"}}>
          حوّل فوضى<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>مطعمك</em><br/><span style={{color:"rgba(240,244,255,.18)"}}>إلى نظام</span>
        </h1>
        <p style={{fontFamily:"Cairo",fontSize:"clamp(15px,2vw,19px)",color:"rgba(240,244,255,.5)",lineHeight:1.85,maxWidth:580,margin:"0 auto 44px"}}>
          نبني لمطعمك منظومة عمليات متكاملة — من المخزون والموظفين حتى التحليلات والتسويق. مصمم خصيصاً للسوق العراقي.
        </p>
        <div className="hero-btns" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
          <a href="https://wa.me/9647734383431" target="_blank" className="cta" style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,padding:"16px 44px",background:"#1a4fc4",color:"#fff",borderRadius:5,textDecoration:"none",boxShadow:"0 0 44px rgba(26,79,196,.4)",display:"flex",alignItems:"center",gap:8}}>📲 استشارة مجانية الآن</a>
          <a href="#services" style={{fontFamily:"Cairo",fontSize:15,fontWeight:700,padding:"15px 36px",background:"transparent",color:"rgba(240,244,255,.6)",border:"1px solid rgba(255,255,255,.12)",borderRadius:5,textDecoration:"none"}}>اكتشف الخدمات ←</a>
        </div>
        <div className="hero-stats" style={{display:"flex",gap:36,justifyContent:"center",flexWrap:"wrap"}}>
          {[{n:"+35%",l:"زيادة الأرباح"},{n:"-28%",l:"تراجع الهدر"},{n:"3x",l:"سرعة الطلبات"},{n:"99%",l:"رضا العملاء"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:"Space Mono",fontSize:"clamp(20px,3vw,26px)",fontWeight:700,color:"#1a4fc4",marginBottom:3}}>{s.n}</div>
              <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.35)",fontWeight:700}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem(){
  const ref=useRef(null);const v=useVis(ref);
  const cards=[
    {icon:"📦",title:"فوضى المخزن",desc:"طلبيات يدوية، مواد تنفد بلا تحذير، هدر يومي يكلّفك آلاف الدنانير شهرياً دون أن تشعر.",stat:"// 30% من التكاليف هدر"},
    {icon:"⏱",title:"تأخر الطلبات",desc:"بدون نظام توجيه واضح، الطلبات تتأخر وتضيع وتكلفك عملاء حقيقيين كل يوم.",stat:"// 6-12 دقيقة ضائعة/طلب"},
    {icon:"📞",title:"اتصالات ضائعة",desc:"لا تعرف كم اتصال وصل ولم يُرد عليه. غياب الكول سنتر = خسارة صامتة متراكمة.",stat:"// 40% من الاتصالات تضيع"},
    {icon:"🤝",title:"بدون CRM",desc:"لا تعرف زبائنك المميزين ولا تملك بيانات تساعدك على استعادتهم.",stat:"// 5x تكلفة جذب زبون جديد"},
    {icon:"👥",title:"إدارة بدون بيانات",desc:"قرارات بالحدس لا بالأرقام — من يعمل في أي وردية، متى الذروة، أي صنف يخسرك.",stat:"// 40% من القرارات خاطئة"},
    {icon:"📉",title:"أرباح أقل مما تستحق",desc:"مطعمك يعمل لكنه لا يُحقق إمكاناته. بدون خطة عمليات واضحة، الأرباح تسرب.",stat:"// 20-35% ربح ضائع"},
  ];
  return(
    <section id="problem" ref={ref} style={{maxWidth:1400,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
      <div className="prob-h" style={{padding:"140px 48px 0"}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:".4em",color:"#00c3ff",marginBottom:20,display:"flex",alignItems:"center",gap:10,fontFamily:"Cairo",opacity:v?1:0,transition:"all .7s"}}>
          <span style={{width:24,height:1,background:"#00c3ff"}}/>التحديات
        </div>
        <h2 style={{fontFamily:"Cairo",fontSize:"clamp(32px,5vw,68px)",fontWeight:900,lineHeight:.95,marginBottom:60,color:"#f0f4ff",opacity:v?1:0,transform:v?"none":"translateY(30px)",transition:"all 1s ease .2s"}}>
          المطاعم تخسر<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>يومياً</em> بدون<br/><span style={{color:"rgba(240,244,255,.18)"}}>نظام حقيقي</span>
        </h2>
      </div>
      <div className="prob-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3,padding:"0 48px 120px"}}>
        {cards.map((c,i)=>(
          <div key={i} className="c3" style={{background:"#060e22",border:"1px solid rgba(255,255,255,.06)",borderRadius:0,padding:"44px 36px",position:"relative",overflow:"hidden",opacity:v?1:0,transform:v?"none":"translateY(30px)",transition:`all .8s ease ${.3+(i%3)*.1}s`}}>
            <span style={{fontSize:32,marginBottom:20,display:"block"}}>{c.icon}</span>
            <h3 style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,marginBottom:10,color:"rgba(240,244,255,.85)"}}>{c.title}</h3>
            <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.5)",lineHeight:1.8,marginBottom:32}}>{c.desc}</p>
            <span style={{position:"absolute",bottom:24,right:36,fontFamily:"Space Mono",fontSize:10,color:"#1a4fc4",letterSpacing:".1em"}}>{c.stat}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services(){
  const ref=useRef(null);const v=useVis(ref);
  const pillars=[
    {p:"🧠 العمليات والإدارة",c:"#1a4fc4",s:[{n:"01",i:"🔍",t:"الاستشارات التشغيلية",d:"نزور مطعمك ونضع خارطة طريق واضحة."},{n:"02",i:"📦",t:"نظام المخزون الذكي",d:"مراقبة تلقائية وطلبيات ذكية."},{n:"03",i:"⚙️",t:"هندسة العمليات",d:"SOP مخصص لكل دور مع آلية الدلفري."},{n:"04",i:"👥",t:"نظام HR",d:"ورديات، بصمات، تقييم أداء، رواتب."},{n:"05",i:"💰",t:"نظام المالية",d:"تقارير أرباح مفصّلة بالأصناف."},{n:"06",i:"🎓",t:"منصة التدريب",d:"محتوى مخصص لكل دور مع متابعة."},{n:"07",i:"🏢",t:"نظام الفرانشايز",d:"منظومة قابلة للتكرار والتوسع."}]},
    {p:"📞 الكول سنتر وتجربة العملاء",c:"#00c3ff",s:[{n:"08",i:"📞",t:"بناء الكول سنتر",d:"استقبال الاتصالات وجرد الضائعة وأعلى تحويل."},{n:"09",i:"🤝",t:"نظام CRM",d:"قاعدة زبائن حية مع تتبع التفضيلات."},{n:"10",i:"🔔",t:"آلية حل الشكاوى",d:"استقبال ومتابعة وإغلاق منظّم."},{n:"11",i:"🚀",t:"استقبال طلبات المنصات",d:"توحيد الطلبات من جميع تطبيقات التوصيل."}]},
    {p:"🍽️ القائمة والهوية الرقمية",c:"#ffd60a",s:[{n:"12",i:"📱",t:"المنيو الإلكتروني",d:"قائمة تفاعلية بصور احترافية."},{n:"13",i:"📄",t:"المنيو الورقي",d:"تصميم بهوية بصرية تعكس شخصيتك."},{n:"14",i:"🌐",t:"صفحة شاملة للمنصات",d:"رابط واحد يضم كل قنوات مطعمك."},{n:"15",i:"💻",t:"الصفحات الإلكترونية",d:"موقع أو صفحة خاصة مع هوية بصرية."}]},
    {p:"📣 التسويق والنمو",c:"#00ff88",s:[{n:"16",i:"📊",t:"لوحة التحكم والتقارير",d:"داشبورد مباشر من هاتفك."},{n:"17",i:"📣",t:"الحملات الترويجية",d:"حملات موسمية تحقق عائداً حقيقياً."},{n:"18",i:"🤳",t:"ربط بالمؤثرين",d:"نختار المناسبين وندير التعاون."},{n:"19",i:"📝",t:"مدونة إدارة المطاعم",d:"محتوى أسبوعي يبني سمعتك."}]},
  ];
  return(
    <section id="services" ref={ref} className="svc-sec" style={{padding:"120px 48px",maxWidth:1400,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
      <div className="svc-header" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"end",marginBottom:64}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:".4em",color:"#00c3ff",marginBottom:16,display:"flex",alignItems:"center",gap:10,fontFamily:"Cairo",opacity:v?1:0,transition:"all .7s"}}>
            <span style={{width:24,height:1,background:"#00c3ff"}}/>الخدمات
          </div>
          <h2 style={{fontFamily:"Cairo",fontSize:"clamp(28px,5vw,64px)",fontWeight:900,lineHeight:.95,color:"#f0f4ff",opacity:v?1:0,transition:"all 1s ease .2s"}}>
            كل ما يحتاجه<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>مطعمك</em>
          </h2>
        </div>
        <p style={{fontFamily:"Cairo",fontSize:"clamp(13px,1.8vw,15px)",color:"rgba(240,244,255,.5)",lineHeight:1.9,opacity:v?1:0,transition:"all 1s ease .3s"}}>
          من التشخيص الأولي حتى المتابعة الشهرية — 19 خدمة متكاملة تغطي كل جانب من جوانب مطعمك.
        </p>
      </div>
      {pillars.map((pl,pi)=>(
        <div key={pi} style={{marginBottom:56}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,opacity:v?1:0,transition:`all .7s ease ${.2+pi*.1}s`}}>
            <span style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,color:pl.c}}>{pl.p}</span>
            <span style={{flex:1,height:1,background:`linear-gradient(to left,transparent,${pl.c}35)`}}/>
          </div>
          <div className="svc-pillar-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:3}}>
            {pl.s.map((s,i)=>(
              <div key={i} className="c3" style={{background:"#060e22",border:"1px solid rgba(255,255,255,.06)",borderTop:`2px solid ${pl.c}20`,borderRadius:0,padding:"36px 28px",opacity:v?1:0,transform:v?"none":"translateY(30px)",transition:`all .9s ease ${.3+(i%4)*.1}s`}}>
                <div style={{fontFamily:"Space Mono",fontSize:9,color:`${pl.c}50`,letterSpacing:".2em",marginBottom:16}}>{s.n}</div>
                <div style={{width:44,height:44,background:`${pl.c}12`,border:`1px solid ${pl.c}25`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:16}}>{s.i}</div>
                <h3 style={{fontFamily:"Cairo",fontSize:16,fontWeight:900,marginBottom:8,lineHeight:1.2,color:"#f0f4ff"}}>{s.t}</h3>
                <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.5)",lineHeight:1.8}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Results(){
  const ref=useRef(null);const v=useVis(ref);
  const results=[
    {n:"+35%",l:"متوسط زيادة الأرباح",c:"#1a4fc4",d:"خلال أول 3 أشهر من تطبيق النظام"},
    {n:"-28%",l:"تراجع الهدر الغذائي",c:"#ffd60a",d:"من خلال نظام المخزون الذكي والـ FIFO"},
    {n:"3x",l:"سرعة معالجة الطلبات",c:"#00c3ff",d:"بعد تطبيق نظام توجيه الطلبات"},
    {n:"99%",l:"رضا عملاء IQR",c:"#00ff88",d:"من أصحاب المطاعم الذين طبقوا النظام"},
    {n:"-45%",l:"تراجع الأخطاء التشغيلية",c:"#1a4fc4",d:"بعد تطبيق SOPs وتدريب الفريق"},
    {n:"+60%",l:"كفاءة ساعات الذروة",c:"#ffd60a",d:"من خلال التخطيط المسبق والاستعداد"},
  ];
  return(
    <section id="results" ref={ref} style={{maxWidth:1400,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
      <div className="res-h" style={{textAlign:"center",padding:"80px 48px 0",opacity:v?1:0,transform:v?"none":"translateY(24px)",transition:"all .8s"}}>
        <h2 style={{fontFamily:"Cairo",fontSize:"clamp(28px,5vw,64px)",fontWeight:900,color:"#f0f4ff",lineHeight:.95,marginBottom:56}}>
          أرقام حقيقية<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>من مطاعم</em> حقيقية
        </h2>
      </div>
      <div className="res-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3,padding:"0 48px 120px"}}>
        {results.map((r,i)=>(
          <div key={i} className="c3" style={{background:"#060e22",border:"1px solid rgba(255,255,255,.06)",borderRadius:0,padding:"44px",textAlign:"center",opacity:v?1:0,transform:v?"none":"translateY(30px)",transition:`all .8s ease ${i*.1}s`}}>
            <div style={{fontFamily:"Space Mono",fontSize:"clamp(36px,4vw,48px)",fontWeight:700,color:r.c,lineHeight:1,marginBottom:12,textShadow:`0 0 36px ${r.c}50`}}>{r.n}</div>
            <h3 style={{fontFamily:"Cairo",fontSize:"clamp(14px,2vw,17px)",fontWeight:900,color:"#f0f4ff",marginBottom:8}}>{r.l}</h3>
            <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.4)",lineHeight:1.7}}>{r.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA(){
  const ref=useRef(null);const v=useVis(ref);
  return(
    <section ref={ref} className="cta-sec" style={{padding:"100px 48px",textAlign:"center",background:"#000510",position:"relative",zIndex:2}}>
      <div style={{maxWidth:660,margin:"0 auto",direction:"rtl"}}>
        <div style={{fontFamily:"Space Mono",fontSize:10,color:"#1a4fc4",letterSpacing:".28em",marginBottom:20,opacity:v?1:0,transition:"all .7s"}}>IQR.IRAQ.2026</div>
        <h2 style={{fontFamily:"Cairo",fontSize:"clamp(32px,6vw,72px)",fontWeight:900,lineHeight:.92,marginBottom:24,color:"#f0f4ff",opacity:v?1:0,transform:v?"none":"translateY(30px)",transition:"all 1s ease .2s"}}>
          مطعمك يستحق<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>نظاماً حقيقياً</em>
        </h2>
        <p style={{fontFamily:"Cairo",fontSize:"clamp(14px,2vw,17px)",color:"rgba(240,244,255,.5)",lineHeight:1.85,marginBottom:44,opacity:v?1:0,transition:"all 1s ease .3s"}}>
          محادثة مجانية نفهم فيها وضعك — بدون التزام، بدون عقود
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",opacity:v?1:0,transition:"all 1s ease .4s"}}>
          <a href="https://wa.me/9647734383431" target="_blank" className="cta" style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,padding:"18px 48px",background:"#1a4fc4",color:"#fff",borderRadius:5,textDecoration:"none",boxShadow:"0 0 44px rgba(26,79,196,.4)"}}>📲 ابدأ محادثة مجانية</a>
          <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:15,fontWeight:700,padding:"17px 36px",background:"rgba(205,127,50,.1)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.22)",borderRadius:5,textDecoration:"none"}}>🔑 الخطة البرونزية</a>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return(
    <footer className="site-footer" style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"56px 48px 32px",direction:"rtl"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:40}}>
          <div>
            <div style={{fontFamily:"Space Mono",fontSize:18,fontWeight:700,color:"#f0f4ff",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%"}}/>IQR
            </div>
            <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.4)",lineHeight:1.8,maxWidth:240}}>الشركة الأولى لإدارة وتطوير المطاعم في العراق — نحول الفوضى إلى دقة.</p>
          </div>
          {[{title:"الخدمات",links:[{l:"الاستشارات",h:"#services"},{l:"نظام المخزون",h:"#services"},{l:"الكول سنتر",h:"#services"},{l:"التسويق",h:"#services"}]},{title:"الموقع",links:[{l:"من نحن",h:"/about/"},{l:"المدونة",h:"/blog/"},{l:"الاشتراكات",h:"/pricing/"},{l:"تواصل",h:"/contact/"}]},{title:"تواصل",links:[{l:"واتساب",h:"https://wa.me/9647734383431"},{l:"info@iqrhq.me",h:"mailto:info@iqrhq.me"},{l:"@iqrhq_ops",h:"https://instagram.com/iqrhq_ops"}]}].map((col,i)=>(
            <div key={i}>
              <div style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.3)",letterSpacing:".12em",marginBottom:16,textTransform:"uppercase"}}>{col.title}</div>
              {col.links.map((lk,j)=>(
                <a key={j} href={lk.h} className="cn" style={{display:"block",fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.5)",textDecoration:"none",marginBottom:8}}>{lk.l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <p style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
          <div style={{display:"flex",gap:14}}>
            <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:11,color:"#cd7f32",textDecoration:"none"}}>🔑 الاشتراكات</a>
            <a href="/login/" style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)",textDecoration:"none"}}>تسجيل الدخول</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function IQRSite(){
  return(
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(26,79,196,.07),transparent 70%)",top:"-15%",right:"-10%",animation:"orb 15s ease-in-out infinite",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,195,255,.05),transparent 70%)",bottom:"15%",left:"-8%",animation:"orb 20s ease-in-out infinite reverse",filter:"blur(100px)"}}/>
      </div>
      <Nav/><Hero/><Problem/><Services/><Results/><CTA/><Footer/>
    </>
  );
}
