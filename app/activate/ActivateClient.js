"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

// هذه الصفحة تُستخدم إذا أردت الاحتفاظ بنظام الروابط كبديل للأدمن
export default function ActivateClient(){
  const sp = useSearchParams();
  const [status, setStatus] = useState("checking");

  useEffect(()=>{
    const token = sp.get("token");
    if(!token){ setStatus("invalid"); return; }
    // Token format: bronze_30d_XXXXX → activate via updating subscription
    if(token.startsWith("bronze_30d_") && token.length > 15){
      // For link-based activation, store in localStorage as fallback
      const exp = Date.now() + 30*24*60*60*1000;
      const data = btoa(JSON.stringify({subscribed:true,expiry:exp,plan:"bronze"}));
      localStorage.setItem("iqr_subscription", data);
      setStatus("success");
    } else {
      setStatus("invalid");
    }
  },[sp]);

  return(
    <>
      <style>{G}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000814",padding:"32px",direction:"rtl"}}>
        {status==="checking"&&(
          <div style={{textAlign:"center"}}>
            <div style={{width:36,height:36,border:"3px solid rgba(205,127,50,.2)",borderTopColor:"#cd7f32",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/>
            <p style={{fontFamily:"Cairo",fontSize:15,color:"rgba(240,244,255,.4)"}}>جاري التحقق...</p>
          </div>
        )}
        {status==="success"&&(
          <div style={{maxWidth:440,textAlign:"center",animation:"fadeUp .8s ease"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#cd7f32,#f5c874)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 20px",animation:"pop .5s ease",boxShadow:"0 0 40px rgba(205,127,50,.5)"}}>🎉</div>
            <h1 style={{fontFamily:"Cairo",fontSize:"clamp(20px,4vw,28px)",fontWeight:900,color:"#f0f4ff",marginBottom:12}}>تم تفعيل اشتراكك!</h1>
            <p style={{fontFamily:"Cairo",fontSize:14,color:"rgba(240,244,255,.5)",lineHeight:1.8,marginBottom:28}}>مرحباً بك في الخطة البرونزية 🥉<br/>يمكنك الآن الوصول لجميع المقالات والداشبورد.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <a href="/blog/" style={{fontFamily:"Cairo",fontSize:14,fontWeight:900,padding:"14px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:10,textDecoration:"none",display:"block",textAlign:"center"}}>ابدأ القراءة 📚</a>
              <a href="/dashboard/" style={{fontFamily:"Cairo",fontSize:14,fontWeight:700,padding:"13px",background:"rgba(26,79,196,.12)",color:"#1a4fc4",border:"1px solid rgba(26,79,196,.25)",borderRadius:10,textDecoration:"none",display:"block",textAlign:"center"}}>افتح الداشبورد 📊</a>
            </div>
          </div>
        )}
        {status==="invalid"&&(
          <div style={{maxWidth:440,textAlign:"center",animation:"fadeUp .8s ease"}}>
            <div style={{fontSize:44,marginBottom:16}}>❌</div>
            <h1 style={{fontFamily:"Cairo",fontSize:"clamp(20px,4vw,26px)",fontWeight:900,color:"#f0f4ff",marginBottom:10}}>رابط غير صالح</h1>
            <p style={{fontFamily:"Cairo",fontSize:13,color:"rgba(240,244,255,.5)",lineHeight:1.8,marginBottom:24}}>تواصل مع فريق IQR للحصول على رابط جديد.</p>
            <a href="https://wa.me/9647734383431" target="_blank" style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"11px 24px",background:"linear-gradient(135deg,#cd7f32,#f5c874)",color:"#000",borderRadius:8,textDecoration:"none",display:"inline-block"}}>📲 واتساب</a>
          </div>
        )}
      </div>
    </>
  );
}
