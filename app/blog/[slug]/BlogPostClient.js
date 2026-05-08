"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { POSTS_CONTENT, POSTS_LIST } from "../../../lib/posts";
import { BlogGate, useSubscription } from "../../../subscription/SubscriptionGate";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .prose h2{font-family:'Cairo';font-size:clamp(19px,3vw,25px);font-weight:900;color:#f0f4ff;margin:44px 0 14px;padding-right:15px;border-right:3px solid #1a4fc4;line-height:1.3}
  .prose h3{font-family:'Cairo';font-size:clamp(15px,2.5vw,18px);font-weight:700;color:rgba(240,244,255,.85);margin:28px 0 10px}
  .prose p{font-family:'Cairo';font-size:clamp(13px,2vw,15px);color:rgba(240,244,255,.6);line-height:2;margin-bottom:18px}
  .prose strong{color:#f0f4ff;font-weight:700}
  .prose ul,.prose ol{margin:0 0 18px;padding:0;list-style:none}
  .prose ul li{font-family:'Cairo';font-size:clamp(12px,1.8vw,14px);color:rgba(240,244,255,.58);line-height:1.9;margin-bottom:9px;padding-right:22px;position:relative}
  .prose ul li::before{content:'';position:absolute;right:0;top:9px;width:6px;height:6px;border-radius:50%;background:#1a4fc4;box-shadow:0 0 7px rgba(26,79,196,.6)}
  .prose ol{counter-reset:step}
  .prose ol li{font-family:'Cairo';font-size:clamp(12px,1.8vw,14px);color:rgba(240,244,255,.58);line-height:1.9;margin-bottom:11px;padding-right:36px;position:relative;counter-increment:step}
  .prose ol li::before{content:counter(step);position:absolute;right:0;top:1px;width:22px;height:22px;border-radius:5px;background:rgba(26,79,196,.15);border:1px solid rgba(26,79,196,.3);color:#1a4fc4;font-size:10px;font-weight:700;font-family:'Space Mono';display:flex;align-items:center;justify-content:center}
  .prose blockquote{border-right:3px solid #1a4fc4;padding:16px 22px;background:rgba(26,79,196,.06);border-radius:0 9px 9px 0;margin:24px 0}
  .prose blockquote p{color:rgba(240,244,255,.72);font-style:italic;margin:0;font-size:clamp(13px,2vw,16px);line-height:1.9}
  .prose .stat-box{background:linear-gradient(135deg,rgba(26,79,196,.08),rgba(0,195,255,.04));border:1px solid rgba(26,79,196,.2);border-radius:13px;padding:22px 26px;margin:24px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .prose .stat-item{text-align:center}
  .prose .stat-num{font-family:'Space Mono';font-size:clamp(22px,4vw,34px);font-weight:700;line-height:1;margin-bottom:6px}
  .prose .stat-label{font-family:'Cairo';font-size:10px;color:rgba(240,244,255,.4);font-weight:600}
  .prose .tip-box{background:rgba(0,255,136,.05);border:1px solid rgba(0,255,136,.18);border-radius:9px;padding:16px 20px;margin:18px 0;display:flex;gap:11px;align-items:flex-start}
  .prose .tip-icon{font-size:18px;flex-shrink:0;margin-top:1px}
  .prose .tip-text{font-family:'Cairo';font-size:clamp(11px,1.8vw,13px);color:rgba(240,244,255,.65);line-height:1.8}
  .prose .warn-box{background:rgba(255,214,10,.05);border:1px solid rgba(255,214,10,.18);border-radius:9px;padding:16px 20px;margin:18px 0;display:flex;gap:11px;align-items:flex-start}
  .prose table{width:100%;border-collapse:collapse;margin:22px 0;overflow-x:auto;display:block}
  .prose th{font-family:'Cairo';font-size:10px;font-weight:700;color:rgba(240,244,255,.38);padding:10px 13px;border-bottom:1px solid rgba(255,255,255,.07);text-align:right;white-space:nowrap}
  .prose td{font-family:'Cairo';font-size:clamp(11px,1.8vw,13px);color:rgba(240,244,255,.6);padding:11px 13px;border-bottom:1px solid rgba(255,255,255,.04);text-align:right}
  .prose tr:last-child td{border-bottom:none}
  .prose tr:hover td{background:rgba(26,79,196,.04)}
  @media(max-width:768px){
    .pnav{padding:13px 18px!important}
    .phdr{padding:86px 18px 36px!important}
    .phdr h1{font-size:clamp(20px,5vw,32px)!important}
    .pbody{padding:0 18px 44px!important}
    .pcta{margin:0 18px 56px!important;padding:28px 22px!important}
    .prel{padding:0 18px 56px!important}
    .pgrid-r{grid-template-columns:1fr!important}
    .prose .stat-box{grid-template-columns:1fr!important}
    .pftr{padding:22px 18px!important}
  }
`;

function Nav({cc}){
  const[s,setS]=useState(false);
  const[prog,setProg]=useState(0);
  useEffect(()=>{
    const f=()=>{setS(window.scrollY>60);const t=document.documentElement.scrollHeight-window.innerHeight;setProg(t>0?(window.scrollY/t)*100:0);};
    window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);
  },[]);
  return(
    <>
      <nav className="pnav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"14px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",background:s?"rgba(0,8,20,.97)":"rgba(0,8,20,.7)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",transition:"all .4s",direction:"rtl"}}>
        <a href="/" style={{fontFamily:"Space Mono",fontSize:17,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR
        </a>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <a href="/blog/" style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"rgba(240,244,255,.5)",textDecoration:"none"}}>← المدونة</a>
          <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,padding:"6px 14px",background:"rgba(205,127,50,.1)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.22)",borderRadius:5,textDecoration:"none"}}>🔑 اشترك</a>
        </div>
      </nav>
      <div style={{position:"fixed",top:0,left:0,right:0,height:2,zIndex:101}}>
        <div style={{height:"100%",background:`linear-gradient(to left,${cc},#1a4fc4)`,width:`${prog}%`,transition:"width .1s",boxShadow:`0 0 7px ${cc}`}}/>
      </div>
    </>
  );
}

// بوابة المعاينة — للمقال الأول (المخزون) تظهر جزء ثم gate
function PreviewGate({children}){
  const{subscribed,checked}=useSubscription();
  const S=`
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    .gb2{transition:all .25s;cursor:pointer}.gb2:hover{transform:translateY(-2px);filter:brightness(1.1);}
  `;
  if(!checked) return <>{children}</>;
  if(subscribed) return <>{children}</>;
  return(
    <>
      <style>{S}</style>
      <div style={{position:"relative"}}>
        {/* المحتوى الكامل يظهر */}
        {children}
        {/* Fade + gate بعد المحتوى */}
        <div style={{marginTop:32,background:"linear-gradient(135deg,#0a1628,#0d1f3d)",border:"1px solid rgba(255,214,10,.22)",borderRadius:14,padding:"36px 28px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(to right,#ffd60a,#f5c874,#ffd60a)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
          <div style={{fontSize:32,marginBottom:12,animation:"float 3s ease-in-out infinite"}}>🔑</div>
          <h3 style={{fontFamily:"Cairo",fontSize:19,fontWeight:900,color:"#f0f4ff",marginBottom:8}}>هذا كان جزءاً مجانياً</h3>
          <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.5)",lineHeight:1.8,maxWidth:400,margin:"0 auto 22px"}}>
            باقي المقال + 9 مقالات أخرى + الداشبورد التفاعلي — كلها بالخطة البرونزية.
          </p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/login/" className="gb2" style={{fontFamily:"Cairo",fontSize:13,fontWeight:900,padding:"12px 24px",background:"#1a4fc4",color:"#fff",borderRadius:8,textDecoration:"none",boxShadow:"0 0 22px rgba(26,79,196,.35)"}}>🔐 سجّل الدخول</a>
            <a href="/pricing/" className="gb2" style={{fontFamily:"Cairo",fontSize:13,fontWeight:900,padding:"12px 22px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:8,textDecoration:"none"}}>اشترك — $100/شهر</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BlogPostClient({params:pp}){
  const rp=useParams();
  const raw=pp?.slug||rp?.slug||"inventory-waste";
  const slug=Array.isArray(raw)?raw[0]:raw;
  const post=POSTS_CONTENT[slug];

  if(!post) return(
    <>
      <style>{G}</style>
      <div style={{background:"#000814",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",direction:"rtl",padding:"32px"}}>
        <div style={{fontSize:44,marginBottom:16}}>📄</div>
        <h1 style={{fontFamily:"Cairo",fontSize:24,fontWeight:900,color:"#f0f4ff",marginBottom:10}}>المقال قيد التحضير</h1>
        <a href="/blog/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"11px 24px",background:"#1a4fc4",color:"#fff",borderRadius:7,textDecoration:"none"}}>العودة للمدونة</a>
      </div>
    </>
  );

  const related=POSTS_LIST.filter(p=>p.slug!==slug).slice(0,3);
  const Content=()=><div className="prose" dangerouslySetInnerHTML={{__html:post.content}}/>;

  return(
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(26,79,196,.07),transparent 70%)",top:0,right:0,filter:"blur(80px)"}}/>
      </div>
      <Nav cc={post.categoryColor}/>

      {/* HEADER */}
      <header className="phdr" style={{paddingTop:100,paddingBottom:40,paddingLeft:44,paddingRight:44,maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl",animation:"fadeUp .8s ease both"}}>
        <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:24,flexWrap:"wrap"}}>
          <a href="/blog/" style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)",textDecoration:"none"}}>المدونة</a>
          <span style={{color:"rgba(240,244,255,.15)"}}>›</span>
          <span style={{fontFamily:"Cairo",fontSize:11,color:post.categoryColor,fontWeight:700}}>{post.category}</span>
          {post.preview&&<span style={{fontFamily:"Cairo",fontSize:9,fontWeight:700,color:"#ffd60a",background:"rgba(255,214,10,.1)",border:"1px solid rgba(255,214,10,.22)",borderRadius:99,padding:"2px 7px"}}>معاينة مجانية</span>}
          {post.locked&&<span style={{fontFamily:"Cairo",fontSize:9,fontWeight:700,color:"#cd7f32",background:"rgba(205,127,50,.1)",border:"1px solid rgba(205,127,50,.22)",borderRadius:99,padding:"2px 7px"}}>🔒 للمشتركين</span>}
        </div>
        <div style={{fontSize:44,marginBottom:16}}>{post.icon}</div>
        <h1 style={{fontFamily:"Cairo",fontWeight:900,color:"#f0f4ff",lineHeight:1.2,marginBottom:14}}>{post.title}</h1>
        <p style={{fontFamily:"Cairo",fontSize:"clamp(13px,2vw,16px)",color:"rgba(240,244,255,.5)",lineHeight:1.8,marginBottom:24,maxWidth:580}}>{post.excerpt}</p>
        <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:99,background:`${post.categoryColor}15`,color:post.categoryColor,border:`1px solid ${post.categoryColor}28`}}>{post.category}</span>
          <span style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)"}}>{post.date}</span>
          <span style={{fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.3)"}}>{post.readTime}</span>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:14}}>
          {post.tags.map(t=><span key={t} style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"rgba(255,255,255,.04)",color:"rgba(240,244,255,.3)",border:"1px solid rgba(255,255,255,.07)"}}>#{t}</span>)}
        </div>
        <div style={{height:1,background:`linear-gradient(to left,transparent,${post.categoryColor}55,transparent)`,marginTop:30}}/>
      </header>

      {/* BODY */}
      <main className="pbody" style={{maxWidth:800,margin:"0 auto",padding:"0 44px 52px",position:"relative",zIndex:2,direction:"rtl"}}>
        {post.preview
          ? <PreviewGate><Content/></PreviewGate>
          : post.locked
            ? <BlogGate><Content/></BlogGate>
            : <Content/>
        }
      </main>

      {/* CTA */}
      <div className="pcta" style={{maxWidth:800,margin:"0 auto 64px",padding:"0 44px",position:"relative",zIndex:2}}>
        <div style={{background:"linear-gradient(135deg,rgba(26,79,196,.1),rgba(0,195,255,.05))",border:"1px solid rgba(26,79,196,.22)",borderRadius:14,padding:"36px",textAlign:"center",direction:"rtl"}}>
          <div style={{fontSize:30,marginBottom:12}}>🚀</div>
          <h3 style={{fontFamily:"Cairo",fontSize:"clamp(16px,3vw,20px)",fontWeight:900,color:"#f0f4ff",marginBottom:8}}>تبي تطبق هذا في مطعمك؟</h3>
          <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.45)",marginBottom:24,lineHeight:1.8,maxWidth:400,margin:"0 auto 24px"}}>محادثة مجانية — بدون التزام.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://wa.me/9647734383431" target="_blank" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"12px 24px",background:"#1a4fc4",color:"#fff",borderRadius:7,textDecoration:"none"}}>📲 واتساب</a>
            <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"11px 20px",background:"rgba(205,127,50,.1)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.22)",borderRadius:7,textDecoration:"none"}}>🔑 الخطة البرونزية</a>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <section className="prel" style={{maxWidth:800,margin:"0 auto 70px",padding:"0 44px",position:"relative",zIndex:2,direction:"rtl"}}>
        <h2 style={{fontFamily:"Cairo",fontSize:20,fontWeight:900,color:"#f0f4ff",marginBottom:18}}>استمر في القراءة</h2>
        <div className="pgrid-r" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
          {related.map(r=>(
            <a key={r.slug} href={`/blog/${r.slug}/`} style={{display:"block",background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:11,padding:"18px",textDecoration:"none",transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor="rgba(26,79,196,.28)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="rgba(255,255,255,.05)";}}>
              <div style={{fontSize:24,marginBottom:9}}>{r.icon}</div>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:99,background:`${r.categoryColor}12`,color:r.categoryColor,border:`1px solid ${r.categoryColor}22`}}>{r.category}</span>
              <h3 style={{fontFamily:"Cairo",fontSize:13,fontWeight:900,color:"#f0f4ff",margin:"9px 0 7px",lineHeight:1.4}}>{r.title}</h3>
              <div style={{display:"flex",alignItems:"center",gap:5,color:"#1a4fc4"}}>
                <span style={{fontFamily:"Cairo",fontSize:10,fontWeight:700}}>اقرأ ←</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="pftr" style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"24px 44px",textAlign:"center",position:"relative",zIndex:2}}>
        <p style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
