"use client";
import { useState, useEffect, useRef } from "react";
import { POSTS_LIST } from "../../lib/posts";
import { useSubscription } from "../../subscription/SubscriptionGate";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
  .ch{transition:transform .25s,box-shadow .25s}.ch:hover{transform:translateY(-4px);box-shadow:0 18px 50px rgba(26,79,196,.16)!important}
  .tag{display:inline-block;padding:3px 11px;border-radius:99px;font-size:11px;font-weight:700}
  .fb{transition:all .2s;cursor:pointer;border:none;font-family:'Cairo',font-weight:700}
  @media(max-width:768px){
    .bn{padding:14px 18px!important}
    .bn-links{display:none!important}
    .bn-mob{display:flex!important}
    .mob-m{display:flex!important}
    .bh1{padding:90px 18px 48px!important}
    .bh1 h1{font-size:clamp(28px,7vw,52px)!important}
    .feat{padding:0 18px 40px!important}
    .feat-in{grid-template-columns:1fr!important;gap:20px!important}
    .feat-pts{display:none!important}
    .ban{margin:0 18px 24px!important;flex-direction:column!important;gap:14px!important;padding:18px!important}
    .frow{padding:0 18px 20px!important}
    .pgrid{padding:0 18px 60px!important;grid-template-columns:1fr!important}
    .bftr{padding:22px 18px!important}
  }
`;

function useVis(ref){const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:.08});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);return v;}

function Nav({user}){
  const[s,setS]=useState(false);
  const[mob,setMob]=useState(false);
  useEffect(()=>{const f=()=>setS(window.scrollY>60);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);
  return(
    <>
      <nav className="bn" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",background:s?"rgba(0,8,20,.97)":"rgba(0,8,20,.6)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",transition:"all .4s",direction:"rtl"}}>
        <a href="/" style={{fontFamily:"Space Mono",fontSize:18,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR
        </a>
        <div className="bn-links" style={{display:"flex",gap:22,alignItems:"center"}}>
          {[{h:"/",l:"الرئيسية"},{h:"/about/",l:"من نحن"},{h:"/blog/",l:"المدونة"},{h:"/contact/",l:"تواصل"}].map(n=>(
            <a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:n.h==="/blog/"?"#1a4fc4":"rgba(240,244,255,.5)",textDecoration:"none",transition:"color .3s"}}
              onMouseEnter={e=>e.target.style.color="#f0f4ff"} onMouseLeave={e=>e.target.style.color=n.h==="/blog/"?"#1a4fc4":"rgba(240,244,255,.5)"}>{n.l}</a>
          ))}
          {user
            ? <a href="/dashboard/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"6px 14px",background:"rgba(0,255,136,.1)",color:"#00ff88",border:"1px solid rgba(0,255,136,.2)",borderRadius:6,textDecoration:"none"}}>📊 الداشبورد</a>
            : <a href="/login/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"6px 14px",background:"rgba(26,79,196,.12)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.22)",borderRadius:6,textDecoration:"none"}}>🔐 دخول</a>
          }
          <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"6px 14px",background:"rgba(205,127,50,.12)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.25)",borderRadius:5,textDecoration:"none"}}>🔑 اشترك</a>
        </div>
        <button className="bn-mob" style={{display:"none",background:"none",border:"none",cursor:"pointer",flexDirection:"column",gap:5,padding:4}} onClick={()=>setMob(v=>!v)}>
          {[0,1,2].map(i=><span key={i} style={{width:22,height:2,background:"#f0f4ff",borderRadius:2,display:"block",transition:"all .3s",transform:mob&&i===0?"rotate(45deg) translateY(7px)":mob&&i===2?"rotate(-45deg) translateY(-7px)":"none",opacity:mob&&i===1?0:1}}/>)}
        </button>
      </nav>
      <div className="mob-m" style={{display:"none",position:"fixed",top:56,left:0,right:0,zIndex:99,background:"rgba(0,8,20,.98)",borderBottom:"1px solid rgba(255,255,255,.07)",flexDirection:"column",padding:"16px 18px",gap:2,backdropFilter:"blur(20px)",transform:mob?"translateY(0)":"translateY(-14px)",opacity:mob?1:0,transition:"all .3s",pointerEvents:mob?"all":"none"}}>
        {[{h:"/",l:"الرئيسية"},{h:"/about/",l:"من نحن"},{h:"/blog/",l:"المدونة"},{h:"/contact/",l:"تواصل"}].map(n=>(
          <a key={n.h} href={n.h} style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,color:"rgba(240,244,255,.7)",textDecoration:"none",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{n.l}</a>
        ))}
        <div style={{display:"flex",gap:10,paddingTop:12}}>
          <a href="/login/" style={{flex:1,fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"10px",background:"rgba(26,79,196,.12)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.2)",borderRadius:7,textDecoration:"none",textAlign:"center"}}>🔐 دخول</a>
          <a href="/pricing/" style={{flex:1,fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"10px",background:"rgba(205,127,50,.12)",color:"#cd7f32",border:"1px solid rgba(205,127,50,.22)",borderRadius:7,textDecoration:"none",textAlign:"center"}}>🔑 اشترك</a>
        </div>
      </div>
    </>
  );
}

function PostCard({post,idx,subscribed}){
  const ref=useRef(null);const vis=useVis(ref);
  const isPreview=post.preview&&!subscribed;
  const isLocked=post.locked&&!subscribed;

  return(
    <div ref={ref} className="ch" style={{background:"#0a1628",border:`1px solid ${isLocked?"rgba(205,127,50,.1)":"rgba(255,255,255,.05)"}`,borderRadius:13,overflow:"hidden",display:"flex",flexDirection:"column",opacity:vis?1:0,transform:vis?"none":"translateY(24px)",transition:`opacity .6s ease ${(idx%3)*.08}s,transform .6s ease ${(idx%3)*.08}s`,position:"relative"}}>
      {isPreview&&<div style={{position:"absolute",top:10,left:10,zIndex:2,background:"rgba(255,214,10,.12)",border:"1px solid rgba(255,214,10,.3)",borderRadius:99,padding:"3px 9px",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9}}>👁️</span><span style={{fontFamily:"Cairo",fontSize:9,fontWeight:700,color:"#ffd60a"}}>معاينة</span></div>}
      {isLocked&&<div style={{position:"absolute",top:10,left:10,zIndex:2,background:"rgba(205,127,50,.12)",border:"1px solid rgba(205,127,50,.28)",borderRadius:99,padding:"3px 9px",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9}}>🔒</span><span style={{fontFamily:"Cairo",fontSize:9,fontWeight:700,color:"#cd7f32"}}>مشتركين</span></div>}
      {!isLocked&&!isPreview&&<div style={{position:"absolute",top:10,left:10,zIndex:2,background:"rgba(0,255,136,.1)",border:"1px solid rgba(0,255,136,.22)",borderRadius:99,padding:"3px 9px"}}><span style={{fontFamily:"Cairo",fontSize:9,fontWeight:700,color:"#00ff88"}}>✓ متاح</span></div>}

      <div style={{padding:"28px 22px 0",flex:1,marginTop:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span className="tag" style={{background:`${post.categoryColor}15`,color:post.categoryColor,border:`1px solid ${post.categoryColor}28`}}>{post.category}</span>
          <span style={{fontFamily:"Space Mono",fontSize:9,color:"rgba(240,244,255,.22)"}}>{post.readTime}</span>
        </div>
        <div style={{fontSize:28,marginBottom:10,filter:isLocked?"grayscale(.7)":"none"}}>{post.icon}</div>
        <h2 style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,color:isLocked?"rgba(240,244,255,.45)":"#f0f4ff",lineHeight:1.35,marginBottom:9}}>{post.title}</h2>
        <p style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.4)",lineHeight:1.8,marginBottom:14}}>
          {isLocked?"اشترك في الخطة البرونزية للوصول لهذا المقال.":isPreview?"معاينة مجانية — اشترك للمقال الكامل.":post.excerpt}
        </p>
        {!isLocked&&(
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
            {post.tags.map(t=><span key={t} className="tag" style={{background:"rgba(255,255,255,.04)",color:"rgba(240,244,255,.3)",border:"1px solid rgba(255,255,255,.06)"}}>#{t}</span>)}
          </div>
        )}
      </div>

      <div style={{padding:"13px 22px",borderTop:"1px solid rgba(255,255,255,.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"Cairo",fontSize:10,color:"rgba(240,244,255,.2)"}}>{post.date}</span>
        {isLocked
          ? <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"#cd7f32",textDecoration:"none"}}>🔑 اشترك ←</a>
          : <a href={`/blog/${post.slug}/`} style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"#1a4fc4",textDecoration:"none"}}>اقرأ المقال ←</a>
        }
      </div>
    </div>
  );
}

export default function BlogClient(){
  const{subscribed,user}=useSubscription();
  const[filter,setFilter]=useState("الكل");
  const featRef=useRef(null);const featVis=useVis(featRef);
  const categories=["الكل",...Array.from(new Set(POSTS_LIST.map(p=>p.category)))];
  const filtered=filter==="الكل"?POSTS_LIST:POSTS_LIST.filter(p=>p.category===filter);
  const featPost=POSTS_LIST[0]; // المخزون أول

  return(
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(26,79,196,.08),transparent 70%)",top:"-10%",right:"-5%",animation:"orb 15s ease-in-out infinite",filter:"blur(60px)"}}/>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,195,255,.05),transparent 70%)",bottom:"10%",left:"-5%",animation:"orb 20s ease-in-out infinite reverse",filter:"blur(80px)"}}/>
      </div>
      <Nav user={user}/>

      {/* HERO */}
      <section className="bh1" style={{minHeight:"48vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"114px 44px 56px",textAlign:"center",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{animation:"fadeUp 1s ease both",maxWidth:600}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".4em",color:"#1a4fc4",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"Cairo"}}>
            <span style={{flex:1,maxWidth:44,height:1,background:"linear-gradient(to right,transparent,#1a4fc4)"}}/>المدونة
            <span style={{flex:1,maxWidth:44,height:1,background:"linear-gradient(to left,transparent,#1a4fc4)"}}/>
          </div>
          <h1 style={{fontFamily:"Cairo",fontWeight:900,lineHeight:.95,marginBottom:18,color:"#f0f4ff"}}>
            معرفة تبني<br/><em style={{fontStyle:"normal",color:"#1a4fc4"}}>مطاعم ناجحة</em>
          </h1>
          <p style={{fontFamily:"Cairo",fontSize:"clamp(13px,2vw,16px)",color:"rgba(240,244,255,.45)",maxWidth:440,margin:"0 auto 24px",lineHeight:1.8}}>مقالات عملية من خبرة حقيقية في إدارة المطاعم في العراق</p>
          {!subscribed&&(
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/login/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"9px 22px",background:"rgba(26,79,196,.12)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.22)",borderRadius:7,textDecoration:"none"}}>🔐 تسجيل الدخول</a>
              <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"9px 22px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:7,textDecoration:"none",boxShadow:"0 0 18px rgba(205,127,50,.3)"}}>🔑 اشترك — $100/شهر</a>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED — المخزون */}
      <section ref={featRef} className="feat" style={{padding:"0 44px 52px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
        <div style={{background:"linear-gradient(135deg,#0a1628,#0d1f3d)",border:"1px solid rgba(255,214,10,.18)",borderRadius:16,overflow:"hidden",opacity:featVis?1:0,transform:featVis?"none":"translateY(24px)",transition:"all .9s ease",position:"relative"}}>
          <div style={{height:2,background:"linear-gradient(to right,#ffd60a,#f5c874,#ffd60a)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
          <div className="feat-in" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
            <div style={{padding:"40px 36px"}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:18}}>
                <span className="tag" style={{background:"rgba(255,214,10,.12)",color:"#ffd60a",border:"1px solid rgba(255,214,10,.28)"}}>⭐ مقال مميز</span>
                <span style={{fontFamily:"Cairo",fontSize:9,fontWeight:700,color:"#ffd60a",background:"rgba(255,214,10,.1)",border:"1px solid rgba(255,214,10,.2)",borderRadius:99,padding:"2px 8px"}}>معاينة مجانية</span>
                <span style={{fontFamily:"Space Mono",fontSize:9,color:"rgba(240,244,255,.22)"}}>6 دقائق</span>
              </div>
              <div style={{fontSize:40,marginBottom:14}}>{featPost.icon}</div>
              <h2 style={{fontFamily:"Cairo",fontSize:"clamp(18px,2.5vw,26px)",fontWeight:900,color:"#f0f4ff",lineHeight:1.25,marginBottom:12}}>{featPost.title}</h2>
              <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.45)",lineHeight:1.8,marginBottom:24}}>{featPost.excerpt}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href={`/blog/${featPost.slug}/`} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"12px 24px",background:"#ffd60a",color:"#000",borderRadius:7,textDecoration:"none",boxShadow:"0 0 20px rgba(255,214,10,.3)"}}>اقرأ المعاينة ←</a>
                {!subscribed&&<a href="/pricing/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"11px 20px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:7,textDecoration:"none"}}>🔑 للمقال الكامل</a>}
              </div>
            </div>
            <div className="feat-pts" style={{padding:"40px 36px",borderRight:"1px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column",justifyContent:"center",gap:12}}>
              {[{i:"📦",t:"إدارة المخزون الذكية"},{i:"📉",t:"تقليل الهدر بشكل علمي"},{i:"💰",t:"زيادة الأرباح الصافية"},{i:"⚡",t:"تطبيق فوري خلال أسبوع"}].map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(255,255,255,.03)",borderRadius:9,border:"1px solid rgba(255,255,255,.05)"}}>
                  <span style={{fontSize:18}}>{p.i}</span>
                  <span style={{fontFamily:"Cairo",fontSize:13,fontWeight:600,color:"rgba(240,244,255,.65)"}}>{p.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION BANNER */}
      {!subscribed&&(
        <section style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl"}}>
          <div className="ban" style={{background:"linear-gradient(135deg,rgba(205,127,50,.07),rgba(205,127,50,.03))",border:"1px solid rgba(205,127,50,.18)",borderRadius:11,padding:"18px 24px",margin:"0 44px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>🔑</span>
              <div>
                <div style={{fontFamily:"Cairo",fontSize:13,fontWeight:900,color:"#f0f4ff",marginBottom:2}}>المخزون — معاينة مجانية، باقي المقالات للمشتركين</div>
                <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)"}}>اشترك للوصول الكامل + الداشبورد</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <a href="/login/" style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,padding:"8px 16px",background:"rgba(26,79,196,.12)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.22)",borderRadius:6,textDecoration:"none",whiteSpace:"nowrap"}}>دخول</a>
              <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,padding:"8px 16px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:6,textDecoration:"none",whiteSpace:"nowrap"}}>$100/شهر</a>
            </div>
          </div>
        </section>
      )}

      {/* FILTER */}
      <section className="frow" style={{padding:"0 44px 24px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl",display:"flex",gap:7,flexWrap:"wrap"}}>
        {categories.map(c=>(
          <button key={c} className="fb" onClick={()=>setFilter(c)} style={{fontSize:11,fontWeight:700,padding:"6px 16px",borderRadius:99,background:filter===c?"#1a4fc4":"rgba(255,255,255,.05)",color:filter===c?"#fff":"rgba(240,244,255,.5)"}}>
            {c}
          </button>
        ))}
      </section>

      {/* GRID */}
      <section className="pgrid" style={{padding:"0 44px 80px",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2,direction:"rtl",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
        {filtered.map((post,i)=><PostCard key={post.id} post={post} idx={i} subscribed={subscribed}/>)}
      </section>

      <footer className="bftr" style={{background:"#000510",borderTop:"1px solid rgba(255,255,255,.05)",padding:"28px 44px",textAlign:"center",position:"relative",zIndex:2}}>
        <p style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.2)"}}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
