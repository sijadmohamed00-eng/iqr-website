"use client";
import { useState } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#cd7f32;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
  .fw input,.fw select{width:100%;font-family:'Cairo',sans-serif;font-size:14px;padding:12px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#f0f4ff;outline:none;transition:all .2s;}
  .fw input:focus,.fw select:focus{border-color:#cd7f32;box-shadow:0 0 0 3px rgba(205,127,50,.1);}
  .fw input::placeholder{color:rgba(240,244,255,.2);}
  .mono{font-family:'Space Mono',monospace!important;letter-spacing:.1em;}
  .pb{transition:all .25s;cursor:pointer;}
  .pb:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 40px rgba(205,127,50,.5)!important;}
  .pb:disabled{opacity:.45;cursor:not-allowed;}
  @media(max-width:768px){
    .co-nav{padding:14px 20px!important}
    .co-wrap{grid-template-columns:1fr!important;padding:20px 16px 60px!important;gap:24px!important}
    .co-sum{position:static!important}
    .card-prev{height:150px!important}
    .card-num{font-size:14px!important}
    .co-grid2{grid-template-columns:1fr!important}
  }
`;

const fc = v => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
const fe = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

function CardPreview({num,name,exp}){
  const [flip,setFlip]=useState(false);
  return(
    <div className="card-prev" style={{perspective:1000,width:"100%",height:170,marginBottom:24,cursor:"pointer"}} onClick={()=>setFlip(f=>!f)}>
      <div style={{width:"100%",height:"100%",position:"relative",transition:"transform .6s",transformStyle:"preserve-3d",transform:flip?"rotateY(180deg)":"none"}}>
        <div style={{position:"absolute",inset:0,borderRadius:14,background:"linear-gradient(135deg,#1a2a4a,#0d1628)",border:"1px solid rgba(205,127,50,.3)",backfaceVisibility:"hidden",padding:"24px",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(to right,#cd7f32,#f5c874,#cd7f32)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
          <div style={{width:36,height:26,background:"linear-gradient(135deg,#cd7f32,#f5c874)",borderRadius:4,marginBottom:20}}/>
          <div className="card-num" style={{fontFamily:"Space Mono",fontSize:16,fontWeight:700,color:"#f0f4ff",letterSpacing:".12em",marginBottom:16,opacity:num?1:.3}}>{num||"•••• •••• •••• ••••"}</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"Cairo",fontSize:8,color:"rgba(240,244,255,.35)",marginBottom:2}}>اسم حامل البطاقة</div>
              <div style={{fontFamily:"Space Mono",fontSize:11,color:"#f0f4ff",opacity:name?1:.3}}>{name||"YOUR NAME"}</div>
            </div>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"Cairo",fontSize:8,color:"rgba(240,244,255,.35)",marginBottom:2}}>EXPIRES</div>
              <div style={{fontFamily:"Space Mono",fontSize:11,color:"#f0f4ff",opacity:exp?1:.3}}>{exp||"MM/YY"}</div>
            </div>
          </div>
          <div style={{position:"absolute",bottom:16,left:20,fontFamily:"Space Mono",fontSize:16,fontWeight:700,color:"rgba(205,127,50,.12)",letterSpacing:".15em"}}>IQR</div>
        </div>
        <div style={{position:"absolute",inset:0,borderRadius:14,background:"linear-gradient(135deg,#0d1628,#1a2a4a)",border:"1px solid rgba(205,127,50,.3)",backfaceVisibility:"hidden",transform:"rotateY(180deg)",overflow:"hidden"}}>
          <div style={{height:40,background:"rgba(0,0,0,.4)",margin:"24px 0 16px"}}/>
          <div style={{padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:12}}>
            <span style={{fontFamily:"Cairo",fontSize:10,color:"rgba(240,244,255,.4)"}}>CVC</span>
            <div style={{background:"#f0f4ff",borderRadius:4,padding:"5px 14px",fontFamily:"Space Mono",fontSize:13,color:"#000814",letterSpacing:".15em"}}>•••</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutClient(){
  const [f,setF]=useState({name:"",phone:"",wh:"",rest:"",city:"",cn:"",cname:"",exp:"",cvc:""});
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [agree,setAgree]=useState(false);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));

  const submit=e=>{
    e.preventDefault();
    if(!agree)return;
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);setDone(true);
      const msg=encodeURIComponent(
        `🔔 طلب اشتراك جديد — IQR البرونزية\n\n`+
        `الاسم: ${f.name}\nالهاتف: ${f.phone}\nواتساب: ${f.wh||f.phone}\n`+
        `المطعم: ${f.rest}\nالمدينة: ${f.city}\n`+
        `آخر 4: •••• ${f.cn.replace(/\s/g,"").slice(-4)}\n`+
        `الخطة: البرونزية — $100/شهر\nأرجو تفعيل الاشتراك 🙏`
      );
      setTimeout(()=>window.open(`https://wa.me/9647734383431?text=${msg}`,"_blank"),800);
    },2200);
  };

  if(done) return(
    <>
      <style>{G}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000814",padding:"32px",direction:"rtl"}}>
        <div style={{maxWidth:460,textAlign:"center",animation:"fadeUp .8s ease"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#cd7f32,#f5c874)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 20px",animation:"pop .5s ease",boxShadow:"0 0 40px rgba(205,127,50,.5)"}}>🎉</div>
          <h1 style={{fontFamily:"Cairo",fontSize:"clamp(22px,4vw,30px)",fontWeight:900,color:"#f0f4ff",marginBottom:12}}>تم الطلب بنجاح!</h1>
          <div style={{background:"rgba(205,127,50,.08)",border:"1px solid rgba(205,127,50,.25)",borderRadius:12,padding:"20px",marginBottom:24}}>
            <p style={{fontFamily:"Cairo",fontSize:14,color:"rgba(240,244,255,.7)",lineHeight:1.9}}>
              تم إرسال طلبك لفريق IQR عبر واتساب.<br/>
              سنرسل لك <strong style={{color:"#cd7f32"}}>إيميل وكلمة مرور</strong> خلال ساعة لتسجيل الدخول.
            </p>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://wa.me/9647734383431" target="_blank" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"11px 24px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:8,textDecoration:"none"}}>افتح واتساب 📲</a>
            <a href="/" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"10px 20px",background:"transparent",color:"rgba(240,244,255,.5)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,textDecoration:"none"}}>الرئيسية</a>
          </div>
        </div>
      </div>
    </>
  );

  return(
    <>
      <style>{G}</style>
      <div style={{minHeight:"100vh",background:"#000814",direction:"rtl"}}>
        <nav className="co-nav" style={{padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <a href="/" style={{fontFamily:"Space Mono",fontSize:17,fontWeight:700,color:"#f0f4ff",textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:7,height:7,background:"#1a4fc4",borderRadius:"50%",animation:"blink 2s infinite"}}/>IQR
          </a>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,255,136,.07)",border:"1px solid rgba(0,255,136,.2)",borderRadius:99,padding:"4px 12px"}}>
              <span style={{fontSize:11}}>🔒</span>
              <span style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,color:"#00ff88"}}>دفع آمن</span>
            </div>
            <a href="/pricing/" style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.4)",textDecoration:"none"}}>← رجوع</a>
          </div>
        </nav>

        <div className="co-wrap" style={{maxWidth:960,margin:"0 auto",padding:"48px 48px 80px",display:"grid",gridTemplateColumns:"1fr 360px",gap:36,alignItems:"start"}}>
          {/* FORM */}
          <div>
            <h1 style={{fontFamily:"Cairo",fontSize:"clamp(20px,3vw,26px)",fontWeight:900,color:"#f0f4ff",marginBottom:6}}>إكمال الاشتراك</h1>
            <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.4)",marginBottom:32,lineHeight:1.7}}>أدخل بياناتك ومعلومات البطاقة — نرسل بيانات الدخول عبر واتساب</p>

            <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:18}}>
              {/* Personal */}
              <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
                <div style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"rgba(240,244,255,.4)",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:18,height:18,background:"#cd7f32",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#000"}}>1</span>
                  معلوماتك الشخصية
                </div>
                <div className="co-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{l:"الاسم الكامل *",k:"name",ph:"اسمك",req:true},{l:"رقم الهاتف *",k:"phone",ph:"07XXXXXXXXX",req:true},{l:"واتساب (إذا مختلف)",k:"wh",ph:"07XXXXXXXXX",req:false},{l:"المدينة *",k:"city",ph:"بغداد...",req:true}].map(fd=>(
                    <div key={fd.k} className="fw">
                      <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:6}}>{fd.l}</label>
                      <input required={fd.req} placeholder={fd.ph} value={f[fd.k]} onChange={e=>u(fd.k,e.target.value)}/>
                    </div>
                  ))}
                  <div className="fw" style={{gridColumn:"1/-1"}}>
                    <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:6}}>اسم المطعم *</label>
                    <input required placeholder="اسم مطعمك" value={f.rest} onChange={e=>u("rest",e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* Card */}
              <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
                <div style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,color:"rgba(240,244,255,.4)",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:18,height:18,background:"#cd7f32",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#000"}}>2</span>
                  بيانات البطاقة
                </div>
                <CardPreview num={f.cn} name={f.cname.toUpperCase()} exp={f.exp}/>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="fw">
                    <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:6}}>اسم حامل البطاقة *</label>
                    <input required placeholder="كما يظهر على البطاقة" value={f.cname} onChange={e=>u("cname",e.target.value)}/>
                  </div>
                  <div className="fw">
                    <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:6}}>رقم البطاقة *</label>
                    <input required className="mono" placeholder="0000 0000 0000 0000" value={f.cn} onChange={e=>u("cn",fc(e.target.value))} maxLength={19}/>
                  </div>
                  <div className="co-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div className="fw">
                      <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:6}}>تاريخ الانتهاء *</label>
                      <input required className="mono" placeholder="MM/YY" value={f.exp} onChange={e=>u("exp",fe(e.target.value))} maxLength={5}/>
                    </div>
                    <div className="fw">
                      <label style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.35)",display:"block",marginBottom:6}}>CVC *</label>
                      <input required className="mono" placeholder="•••" value={f.cvc} onChange={e=>u("cvc",e.target.value.replace(/\D/g,"").slice(0,4))} maxLength={4} type="password"/>
                    </div>
                  </div>
                </div>
                <div style={{marginTop:14,padding:"9px 12px",background:"rgba(0,255,136,.05)",border:"1px solid rgba(0,255,136,.12)",borderRadius:7,display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:13}}>🔒</span>
                  <span style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)"}}>بياناتك محمية — التحقق يدوياً عبر واتساب من فريق IQR</span>
                </div>
              </div>

              {/* Agree */}
              <div style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}} onClick={()=>setAgree(v=>!v)}>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${agree?"#cd7f32":"rgba(255,255,255,.2)"}`,background:agree?"#cd7f32":"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                  {agree&&<span style={{color:"#000",fontSize:11,fontWeight:900}}>✓</span>}
                </div>
                <span style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.5)",lineHeight:1.7}}>
                  أوافق على شروط الاستخدام وأعلم أن اشتراكي يُفعَّل بعد تأكيد الدفع عبر واتساب.
                </span>
              </div>

              <button type="submit" disabled={!agree||loading} className="pb" style={{fontFamily:"Cairo",fontSize:15,fontWeight:900,padding:"16px",background:agree?"linear-gradient(135deg,#cd7f32,#f5c874)":"rgba(205,127,50,.25)",color:agree?"#000":"rgba(0,0,0,.3)",border:"none",borderRadius:10,boxShadow:agree?"0 0 36px rgba(205,127,50,.35)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                {loading?(<><div style={{width:16,height:16,border:"2px solid rgba(0,0,0,.3)",borderTopColor:"#000",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>جاري المعالجة...</>):<>💳 إتمام الاشتراك — $100/شهر</>}
              </button>
            </form>
          </div>

          {/* SUMMARY */}
          <div className="co-sum" style={{position:"sticky",top:24}}>
            <div style={{background:"#0a1628",border:"1px solid rgba(205,127,50,.2)",borderRadius:16,overflow:"hidden"}}>
              <div style={{height:3,background:"linear-gradient(to right,#cd7f32,#f5c874,#cd7f32)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
              <div style={{padding:"24px"}}>
                <div style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"rgba(240,244,255,.3)",letterSpacing:".08em",marginBottom:18}}>ملخص الطلب</div>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:"14px",background:"rgba(205,127,50,.06)",border:"1px solid rgba(205,127,50,.15)",borderRadius:10}}>
                  <span style={{fontSize:26}}>🥉</span>
                  <div>
                    <div style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,color:"#cd7f32"}}>الخطة البرونزية</div>
                    <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)"}}>اشتراك شهري — ألغِ متى تريد</div>
                  </div>
                </div>
                {["📚 وصول كامل للمدونة","📊 الداشبورد التفاعلي","📈 تقارير الأداء","💡 توصيات الذكاء الاصطناعي","📬 النشرة الأسبوعية","⚡ أولوية واتساب"].map((x,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                    <span style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.6)",flex:1}}>{x}</span>
                    <span style={{color:"#00ff88",fontSize:11,fontWeight:700}}>✓</span>
                  </div>
                ))}
                <div style={{height:1,background:"rgba(255,255,255,.06)",margin:"18px 0"}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontFamily:"Cairo",fontSize:12,color:"rgba(240,244,255,.45)"}}>الاشتراك الشهري</span>
                  <span style={{fontFamily:"Space Mono",fontSize:14,fontWeight:700,color:"#f0f4ff"}}>$100</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                  <span style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)"}}>بالدينار</span>
                  <span style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.3)"}}>≈ 130,000 د.ع</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,color:"#f0f4ff"}}>الإجمالي</span>
                  <span style={{fontFamily:"Space Mono",fontSize:20,fontWeight:700,color:"#cd7f32"}}>$100</span>
                </div>
                <div style={{marginTop:18,padding:"11px 14px",background:"rgba(26,79,196,.06)",border:"1px solid rgba(26,79,196,.15)",borderRadius:8}}>
                  <div style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,color:"#1a4fc4",marginBottom:3}}>📲 بعد الدفع</div>
                  <div style={{fontFamily:"Cairo",fontSize:11,color:"rgba(240,244,255,.4)",lineHeight:1.7}}>نرسل لك إيميل + باسورد على واتساب خلال ساعة لتسجيل الدخول.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
