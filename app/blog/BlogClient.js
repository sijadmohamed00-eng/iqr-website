"use client";
import { useState, useEffect, useRef } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#ff2d7a;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  .card-hover{transition:transform .25s ease,box-shadow .25s ease}
  .card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(255,45,122,.18)!important}
  .tag{display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.08em}
`;

const POSTS = [
  {
    id:1, slug:"inventory-waste",
    category:"المخزون", categoryColor:"#ffd60a",
    title:"كيف تقلل هدر مطعمك بنسبة 30% خلال شهر واحد",
    excerpt:"الهدر الغذائي هو أكبر عدو لأرباح مطعمك — في هذا المقال نكشف الأسباب الحقيقية وكيف تعالجها بأنظمة بسيطة.",
    date:"15 أبريل 2026", readTime:"6 دقائق", icon:"📦",
    tags:["مخزون","هدر","أرباح"]
  },
  {
    id:2, slug:"peak-hours",
    category:"التحليلات", categoryColor:"#00c3ff",
    title:"ساعات الذروة: كيف تستعد وتضاعف إيراداتك في أصعب الأوقات",
    excerpt:"معظم المطاعم تخسر في وقت الذروة لأنها غير مستعدة — اكتشف كيف تحوّل الضغط إلى فرصة ربح حقيقية.",
    date:"8 أبريل 2026", readTime:"5 دقائق", icon:"📊",
    tags:["تحليل","ذروة","إيرادات"]
  },
  {
    id:3, slug:"staff-management",
    category:"الموظفون", categoryColor:"#00ff88",
    title:"إدارة موظفي المطعم: من الفوضى إلى النظام في 4 خطوات",
    excerpt:"فريق غير منظم يكلفك أكثر من فريق صغير منضبط — دليل عملي لبناء فريق مطعم يعمل بدون تدخل يومي منك.",
    date:"1 أبريل 2026", readTime:"8 دقائق", icon:"👥",
    tags:["موظفون","إدارة","ورديات"]
  },
  {
    id:4, slug:"menu-engineering",
    category:"الربحية", categoryColor:"#ff2d7a",
    title:"هندسة قائمة الطعام: أي أصناف تجلب الربح وأيها تكلفك؟",
    excerpt:"ليس كل صنف في قائمتك يستحق مكانه — تعلم كيف تحلل هوامش الربح وتحسّن قائمتك لتزيد أرباحك دون رفع الأسعار.",
    date:"24 مارس 2026", readTime:"7 دقائق", icon:"🍽️",
    tags:["قائمة","ربحية","تسعير"]
  },
  {
    id:5, slug:"order-routing",
    category:"العمليات", categoryColor:"#00c3ff",
    title:"توجيه الطلبات الذكي: كيف تنهي فوضى المطبخ إلى الأبد",
    excerpt:"الفوضى في المطبخ ليست قدراً — هي نتيجة غياب نظام واضح لتوجيه الطلبات. هذا ما يجب أن تفعله.",
    date:"15 مارس 2026", readTime:"5 دقائق", icon:"⚡",
    tags:["طلبات","مطبخ","كفاءة"]
  },
  {
    id:6, slug:"iraq-restaurant-market",
    category:"السوق العراقي", categoryColor:"#ffd60a",
    title:"سوق المطاعم في العراق 2026: الفرص والتحديات",
    excerpt:"تحليل شامل لواقع قطاع المطاعم في العراق — أين الفرص الحقيقية وما هي التحديات التي تواجه أصحاب المطاعم اليوم.",
    date:"5 مارس 2026", readTime:"10 دقائق", icon:"🇮🇶",
    tags:["عراق","سوق","تحليل"]
  },
];

function useVisible(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);obs.disconnect();} }, {threshold:.1});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return v;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",
      background:scrolled?"rgba(0,8,20,.95)":"transparent",backdropFilter:scrolled?"blur(24px)":"none",
      borderBottom:scrolled?"1px solid rgba(255,45,122,.1)":"none",transition:"all .4s ease",direction:"rtl"}}>
      <a href="/" style={{fontFamily:"Space Mono",fontSize:20,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
        <span style={{width:8,height:8,background:"#ff2d7a",borderRadius:"50%",animation:"blink 2s infinite"}}/>
        IQR<span style={{color:"#ff2d7a",fontSize:13,fontWeight:400,fontFamily:"Cairo",marginRight:6}}>لإدارة المطاعم</span>
      </a>
      <div style={{display:"flex",gap:24,alignItems:"center"}}>
        {[{h:"/",l:"الرئيسية"},{h:"/about",l:"من نحن"},{h:"/blog",l:"المدونة"},{h:"/contact",l:"تواصل"}].map(n=>(
          <a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:n.h==="/blog"?"#ff2d7a":"rgba(240,244,255,.5)",textDecoration:"none",transition:"color .3s"}}
            onMouseEnter={e=>e.target.style.color="#f0f4ff"} onMouseLeave={e=>e.target.style.color=n.h==="/blog"?"#ff2d7a":"rgba(240,244,255,.5)"}>{n.l}</a>
        ))}
        <a href="https://wa.me/9647734383437" target="_blank" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"8px 20px",background:"#ff2d7a",color:"#fff",borderRadius:4,textDecoration:"none",boxShadow:"0 0 16px rgba(255,45,122,.3)"}}>تواصل 💬</a>
      </div>
    </nav>
  );
}

function PostCard({post, idx}) {
  const ref = useRef(null);
  const visible = useVisible(ref);
  return (
    <div ref={ref} className="card-hover" style={{
      background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,overflow:"hidden",
      opacity:visible?1:0,transform:visible?"none":"translateY(30px)",
      transition:`opacity .7s ease ${(idx%3)*.1}s, transform .7s ease ${(idx%3)*.1}s`,
      display:"flex",flexDirection:"column"
    }}>
      {/* Card top */}
      <div style={{padding:"32px 28px 0",flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span className="tag" style={{background:`${post.categoryColor}15`,color:post.categoryColor,border:`1px solid ${post.categoryColor}30`}}>{post.category}</span>
          <span style={{fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.25)"}}>{post.readTime}</span>
        </div>
        <div style={{fontSize:32,marginBottom:16}}>{post.icon}</div>
        <h2 style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:"#f0f4ff",lineHeight:1.3,marginBottom:12}}>{post.title}</h2>
        <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.4)",lineHeight:1.8,marginBottom:20}}>{post.excerpt}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
          {post.tags.map(t=>(
            <span key={t} className="tag" style={{background:"rgba(255,255,255,.04)",color:"rgba(240,244,255,.35)",border:"1px solid rgba(255,255,255,.06)"}}>#{t}</span>
          ))}
        </div>
      </div>
      {/* Card bottom */}
      <div style={{padding:"16px 28px",borderTop:"1px solid rgba(255,255,255,.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.25)"}}>{post.date}</span>
        <a href={`/blog/${post.slug}`} style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"#ff2d7a",textDecoration:"none",display:"flex",alignItems:"center",gap:6,transition:"gap .2s"}}
          onMouseEnter={e=>e.currentTarget.style.gap="10px"} onMouseLeave={e=>e.currentTarget.style.gap="6px"}>
          اقرأ المقال ←
        </a>
      </div>
    </div>
  );
}

export default function BlogClient() {
  const [filter, setFilter] = useState("الكل");
  const categories = ["الكل", ...Array.from(new Set(POSTS.map(p=>p.category)))];
  const filtered = filter==="الكل" ? POSTS : POSTS.filter(p=>p.category===filter);
  const featuredRef = useRef(null);
  const featuredVisible = useVisible(featuredRef);

  return (
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(255,45,122,.08),transparent 70%)",top:"-10%",right:"-5%",animation:"orb 15s ease-in-out infinite",filter:"blur(60px)"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,195,255,.05),transparent 70%)",bottom:"10%",left:"-5%",animation:"orb 20s ease-in-out infinite reverse",filter:"blur(80px)"}}/>
      </div>
      <Nav/>

      {/* HERO */}
      <section style={{minHeight:"50vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 48px 60px",textAlign:"center",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{animation:"fadeUp 1s ease both"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".4em",color:"#ff2d7a",textTransform:"uppercase",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"center",gap:16,fontFamily:"Cairo"}}>
            <span style={{flex:1,maxWidth:60,height:1,background:"linear-gradient(to right,transparent,#ff2d7a)"}}/>
            المدونة
            <span style={{flex:1,maxWidth:60,height:1,background:"linear-gradient(to left,transparent,#ff2d7a)"}}/>
          </div>
          <h1 style={{fontFamily:"Cairo",fontSize:"clamp(40px,6vw,80px)",fontWeight:900,lineHeight:.95,marginBottom:24,color:"#f0f4ff"}}>
            معرفة تبني<br/><em style={{fontStyle:"normal",color:"#ff2d7a"}}>مطاعم ناجحة</em>
          </h1>
          <p style={{fontFamily:"Cairo",fontSize:17,color:"rgba(240,244,255,.45)",maxWidth:500,margin:"0 auto",lineHeight:1.8}}>
            مقالات عملية من خبرة حقيقية في إدارة وتطوير المطاعم في العراق
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section ref={featuredRef} style={{padding:"0 48px 60px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{
          background:"linear-gradient(135deg, #0a1628, #0d1f3d)",
          border:"1px solid rgba(255,45,122,.15)",borderRadius:16,padding:"48px",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center",
          opacity:featuredVisible?1:0,transform:featuredVisible?"none":"translateY(30px)",
          transition:"all .9s ease",position:"relative",overflow:"hidden"
        }}>
          <div style={{position:"absolute",top:0,right:0,width:300,height:300,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(255,45,122,.08),transparent 70%)",pointerEvents:"none"}}/>
          <div>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
              <span className="tag" style={{background:"rgba(255,45,122,.15)",color:"#ff2d7a",border:"1px solid rgba(255,45,122,.3)"}}>⭐ مقال مميز</span>
              <span style={{fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.25)"}}>6 دقائق</span>
            </div>
            <h2 style={{fontFamily:"Cairo",fontSize:"clamp(22px,3vw,36px)",fontWeight:900,color:"#f0f4ff",lineHeight:1.2,marginBottom:16}}>
              {POSTS[0].title}
            </h2>
            <p style={{fontFamily:"Cairo",fontSize:15,color:"rgba(240,244,255,.45)",lineHeight:1.8,marginBottom:28}}>{POSTS[0].excerpt}</p>
            <a href={`/blog/${POSTS[0].slug}`} style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"14px 32px",background:"#ff2d7a",color:"#fff",borderRadius:8,textDecoration:"none",boxShadow:"0 0 30px rgba(255,45,122,.3)",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 40px rgba(255,45,122,.5)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 0 30px rgba(255,45,122,.3)"}}>
              اقرأ المقال ←
            </a>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[
              {icon:"📦",text:"إدارة المخزون الذكية"},
              {icon:"📉",text:"تقليل الهدر بشكل علمي"},
              {icon:"💰",text:"زيادة الأرباح الصافية"},
              {icon:"⚡",text:"تطبيق فوري خلال أسبوع"},
            ].map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",background:"rgba(255,255,255,.03)",borderRadius:10,border:"1px solid rgba(255,255,255,.05)"}}>
                <span style={{fontSize:20}}>{p.icon}</span>
                <span style={{fontFamily:"Cairo",fontSize:14,fontWeight:600,color:"rgba(240,244,255,.65)"}}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section style={{padding:"0 48px 32px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {categories.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{
              fontFamily:"Cairo",fontSize:12,fontWeight:700,padding:"8px 20px",borderRadius:99,border:"none",cursor:"pointer",
              background:filter===c?"#ff2d7a":"rgba(255,255,255,.05)",
              color:filter===c?"#fff":"rgba(240,244,255,.5)",transition:"all .2s"
            }}>{c}</button>
          ))}
        </div>
      </section>

      {/* POSTS GRID */}
      <section style={{padding:"0 48px 100px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
          {filtered.map((post,i)=><PostCard key={post.id} post={post} idx={i}/>)}
        </div>
        {filtered.length===0 && (
          <div style={{textAlign:"center",padding:"80px",color:"rgba(240,244,255,.2)",fontSize:16,fontFamily:"Cairo"}}>لا توجد مقالات في هذا التصنيف</div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section style={{padding:"80px 48px",background:"#000510",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{maxWidth:500,margin:"0 auto",direction:"rtl"}}>
          <div style={{fontSize:36,marginBottom:16}}>📬</div>
          <h2 style={{fontFamily:"Cairo",fontSize:28,fontWeight:900,color:"#f0f4ff",marginBottom:12}}>اشترك في نشرتنا</h2>
          <p style={{fontFamily:"Cairo",fontSize:14,color:"rgba(240,244,255,.4)",marginBottom:28,lineHeight:1.8}}>مقال أسبوعي عملي لتطوير مطعمك — مباشرة على واتساب</p>
          <a href="https://wa.me/9647734383437?text=أريد+الاشتراك+في+نشرة+IQR+الأسبوعية" target="_blank" style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"14px 36px",background:"#ff2d7a",color:"#fff",borderRadius:8,textDecoration:"none",boxShadow:"0 0 30px rgba(255,45,122,.3)"}}>
            📲 اشترك عبر واتساب
          </a>
        </div>
      </section>

      <footer style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"40px 48px",textAlign:"center",position:"relative",zIndex:2}}>
        <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
