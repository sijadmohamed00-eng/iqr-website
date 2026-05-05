"use client";
import { useState, useEffect, useRef } from "react";

const MOCK = {
  stats: [
    { id:"revenue", label:"الإيرادات اليوم", value:847500, prev:712000, unit:"د.ع", icon:"💰", color:"#1a4fc4" },
    { id:"orders",  label:"الطلبات",         value:143,    prev:118,    unit:"طلب", icon:"🧾", color:"#00c3ff" },
    { id:"waste",   label:"الهدر",           value:4.2,    prev:6.8,    unit:"%",   icon:"♻️", color:"#ffd60a" },
    { id:"rating",  label:"رضا العملاء",     value:94,     prev:91,     unit:"%",   icon:"⭐", color:"#00ff88" },
  ],
  orders: [
    { id:"ORD-441", table:7,  items:["برغر دبل","كولا"],        status:"done",      time:"14:32", amount:18500, station:"A" },
    { id:"ORD-442", table:3,  items:["شاورما دجاج","عصير"],    status:"preparing", time:"14:38", amount:12000, station:"B" },
    { id:"ORD-443", table:12, items:["بيتزا مارغريتا","ماء"],   status:"pending",   time:"14:41", amount:22000, station:"A" },
    { id:"ORD-444", table:1,  items:["كباب مشوي","خبز"],       status:"preparing", time:"14:43", amount:16500, station:"C" },
    { id:"ORD-445", table:9,  items:["سلطة سيزر","شوربة"],     status:"pending",   time:"14:45", amount:9500,  station:"B" },
    { id:"ORD-446", table:5,  items:["ستيك ريب آي","بطاطا"],   status:"done",      time:"14:28", amount:35000, station:"A" },
    { id:"ORD-447", table:8,  items:["دجاج مشوي","أرز"],       status:"preparing", time:"14:40", amount:14000, station:"C" },
  ],
  inventory: [
    { id:1, name:"دجاج",         unit:"كغ",   current:12, min:20, max:100, cost:8500,  supplier:"شركة الطيور الذهبية" },
    { id:2, name:"لحم بقر",      unit:"كغ",   current:8,  min:15, max:80,  cost:15000, supplier:"مزرعة الأمل" },
    { id:3, name:"أرز بسمتي",    unit:"كغ",   current:45, min:20, max:120, cost:3200,  supplier:"مستودع الحبوب" },
    { id:4, name:"طماطم",        unit:"كغ",   current:18, min:10, max:60,  cost:1800,  supplier:"سوق الخضروات" },
    { id:5, name:"زيت نباتي",    unit:"لتر",  current:6,  min:10, max:50,  cost:4500,  supplier:"شركة الزيوت" },
    { id:6, name:"خبز عربي",     unit:"رغيف", current:89, min:50, max:200, cost:500,   supplier:"مخبز الأصيل" },
    { id:7, name:"جبن موزاريلا", unit:"كغ",   current:4,  min:8,  max:40,  cost:12000, supplier:"ألبان الشرق" },
    { id:8, name:"بطاطا",        unit:"كغ",   current:32, min:15, max:80,  cost:1200,  supplier:"سوق الخضروات" },
  ],
  employees: [
    { id:1, name:"أحمد محمد",  role:"طباخ رئيسي",  shift:"صباحي", orders:42, rating:96, status:"active", avatar:"أح" },
    { id:2, name:"سارة علي",   role:"كاشير",        shift:"صباحي", orders:38, rating:98, status:"active", avatar:"سع" },
    { id:3, name:"محمد حسين",  role:"طباخ مساعد",  shift:"مسائي", orders:31, rating:89, status:"break",  avatar:"مح" },
    { id:4, name:"فاطمة كريم", role:"خدمة طاولات", shift:"صباحي", orders:29, rating:94, status:"active", avatar:"فك" },
    { id:5, name:"علي عبدالله",role:"طباخ مساعد",  shift:"مسائي", orders:0,  rating:91, status:"off",    avatar:"عع" },
  ],
  weeklyRevenue: [420000,510000,380000,680000,720000,590000,847500],
  weekDays: ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"],
  topItems: [
    { name:"برغر دبل",      orders:48, revenue:888000, margin:62 },
    { name:"شاورما دجاج",   orders:41, revenue:492000, margin:71 },
    { name:"ستيك ريب آي",   orders:22, revenue:770000, margin:48 },
    { name:"بيتزا مارغريتا",orders:35, revenue:770000, margin:58 },
    { name:"كباب مشوي",     orders:29, revenue:478500, margin:66 },
  ],
  peakHours: [2,1,0,0,1,3,8,14,18,22,19,24,28,31,26,22,18,29,34,38,32,24,15,8],
  notifications: [
    { id:1, type:"warning", msg:"مخزون الدجاج وصل للحد الأدنى — 12 كغ", time:"منذ 5 دقائق" },
    { id:2, type:"warning", msg:"مخزون الجبن الموزاريلا منخفض — 4 كغ",  time:"منذ 12 دقيقة" },
    { id:3, type:"success", msg:"تم إرسال طلبية تلقائية للطيور الذهبية", time:"منذ 5 دقائق" },
    { id:4, type:"info",    msg:"ذروة متوقعة 7-9 م — جهّز 3 طباخين",    time:"منذ 18 دقيقة" },
    { id:5, type:"success", msg:"الإيرادات اليوم تجاوزت الأمس بـ 19%",   time:"منذ 30 دقيقة" },
  ],
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
  .ch{transition:transform .2s,box-shadow .2s}.ch:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(26,79,196,.15)!important}
  .bh{transition:all .2s;cursor:pointer}.bh:hover{transform:translateY(-1px);filter:brightness(1.1);}
  .rh{transition:background .15s}.rh:hover{background:rgba(26,79,196,.04)!important}
  .ni{transition:all .2s;cursor:pointer}.ni:hover{background:rgba(255,255,255,.05)!important}
  .ni.active{background:rgba(26,79,196,.1)!important;border-right:2px solid #1a4fc4}

  /* MOBILE RESPONSIVE */
  @media(max-width:900px){
    .dash-sidebar{width:56px!important}
    .dash-sidebar .nav-label{display:none!important}
    .dash-sidebar .logo-text{display:none!important}
    .dash-sidebar .user-info{display:none!important}
    .dash-topbar{padding:0 16px!important}
    .dash-main{padding:16px!important}
    .stat-grid{grid-template-columns:1fr 1fr!important}
    .overview-charts{grid-template-columns:1fr!important}
    .employees-grid{grid-template-columns:1fr!important}
    .analytics-charts{grid-template-columns:1fr!important}
    .hide-mob{display:none!important}
    .settings-form-grid{grid-template-columns:1fr!important}
    .orders-table{font-size:11px!important}
    .orders-table th,.orders-table td{padding:9px 10px!important}
  }
  @media(max-width:480px){
    .stat-grid{grid-template-columns:1fr!important}
    .dash-notif-panel{width:300px!important;right:0!important;left:0!important}
  }
`;

const fmt = n => n>=1000000?(n/1000000).toFixed(1)+"م":n>=1000?(n/1000).toFixed(0)+"ك":n;
const pct = (c,p) => (((c-p)/p)*100).toFixed(1);
const clamp = (v,mn,mx) => Math.min(Math.max(v,mn),mx);

function useVis(ref){
  const[v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:.1});
    if(ref.current)o.observe(ref.current);return()=>o.disconnect();
  },[]);
  return v;
}

function useCounter(target,active,dur=1100){
  const[val,setVal]=useState(0);
  useEffect(()=>{
    if(!active)return;
    let s=0;const step=target/55;
    const id=setInterval(()=>{s=Math.min(s+step,target);setVal(parseFloat(s.toFixed(1)));if(s>=target)clearInterval(id);},dur/55);
    return()=>clearInterval(id);
  },[active,target]);
  return val;
}

const SM = {
  done:      {l:"منجز",   c:"#00ff88",bg:"rgba(0,255,136,.1)"},
  preparing: {l:"يُحضَّر",c:"#ffd60a",bg:"rgba(255,214,10,.1)"},
  pending:   {l:"انتظار", c:"#00c3ff",bg:"rgba(0,195,255,.1)"},
  active:    {l:"نشط",    c:"#00ff88",bg:"rgba(0,255,136,.1)"},
  break:     {l:"استراحة",c:"#ffd60a",bg:"rgba(255,214,10,.1)"},
  off:       {l:"غائب",   c:"rgba(240,244,255,.3)",bg:"rgba(255,255,255,.05)"},
  warning:   {l:"تحذير",  c:"#ffd60a",bg:"rgba(255,214,10,.08)"},
  success:   {l:"نجاح",   c:"#00ff88",bg:"rgba(0,255,136,.08)"},
  info:      {l:"معلومة", c:"#00c3ff",bg:"rgba(0,195,255,.08)"},
};

function Badge({type}){const s=SM[type]||SM.info;return <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,color:s.c,background:s.bg,whiteSpace:"nowrap"}}>{s.l}</span>;}

function Spark({data,color="#1a4fc4",h=32}){
  const max=Math.max(...data),min=Math.min(...data);
  const pts=data.map((v,i)=>{const x=(i/(data.length-1))*100;const y=h-((v-min)/(max-min||1))*(h-4)-2;return`${x},${y}`;}).join(" ");
  return <svg width="100%" height={h} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" style={{overflow:"visible"}}>
    <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

function BarChart({data,labels,color,active}){
  const max=Math.max(...data);
  return <div style={{display:"flex",alignItems:"flex-end",gap:5,height:110,padding:"0 4px"}}>
    {data.map((v,i)=>{
      const isT=i===data.length-1;
      return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,height:"100%",justifyContent:"flex-end"}}>
        <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:isT?color:`${color}50`,height:active?`${(v/max)*100}%`:"0%",transition:`height 1s cubic-bezier(.4,0,.2,1) ${i*.06}s`,minHeight:2,boxShadow:isT?`0 0 10px ${color}60`:"none"}}/>
        <span style={{fontFamily:"Space Mono",fontSize:8,color:"rgba(240,244,255,.3)",whiteSpace:"nowrap"}}>{labels[i]}</span>
      </div>;
    })}
  </div>;
}

function PeakHours({data,active}){
  const max=Math.max(...data);
  return <div style={{display:"flex",gap:2,alignItems:"flex-end",height:52}}>
    {data.map((v,i)=>{
      const p=v/max;
      const c=p>.8?"#1a4fc4":p>.5?"#ffd60a":p>.2?"#00c3ff":"rgba(255,255,255,.08)";
      return <div key={i} style={{flex:1,borderRadius:2,background:c,height:active?`${Math.max(p*100,4)}%`:"4%",transition:`height .8s ease ${i*.02}s`,opacity:active?1:0}}/>;
    })}
  </div>;
}

function StatCard({stat,idx}){
  const ref=useRef(null);const vis=useVis(ref);
  const val=useCounter(stat.value,vis);
  const diff=pct(stat.value,stat.prev);
  const up=parseFloat(diff)>=0;
  return(
    <div ref={ref} className="ch" style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"24px 20px",position:"relative",overflow:"hidden",opacity:vis?1:0,transform:vis?"none":"translateY(16px)",transition:`opacity .6s ease ${idx*.1}s,transform .6s ease ${idx*.1}s`}}>
      <div style={{position:"absolute",top:-24,right:-24,width:80,height:80,borderRadius:"50%",background:`radial-gradient(${stat.color}20,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{width:40,height:40,borderRadius:9,background:`${stat.color}15`,border:`1px solid ${stat.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{stat.icon}</div>
        <span style={{fontSize:11,fontWeight:700,color:up?"#00ff88":"#1a4fc4",background:up?"rgba(0,255,136,.08)":"rgba(26,79,196,.08)",padding:"3px 8px",borderRadius:99}}>{up?"+":""}{diff}%</span>
      </div>
      <div style={{fontFamily:"Space Mono",fontSize:"clamp(20px,2.5vw,26px)",fontWeight:700,color:stat.color,lineHeight:1,marginBottom:4}}>
        {stat.id==="revenue"?fmt(Math.round(val)):val.toFixed(stat.id==="waste"||stat.id==="rating"?1:0)}{stat.unit==="د.ع"?" د.ع":stat.unit==="طلب"?" طلب":stat.unit==="%"?"%":""}
      </div>
      <div style={{fontSize:12,color:"rgba(240,244,255,.4)",fontWeight:600,marginBottom:8}}>{stat.label}</div>
      <Spark data={MOCK.weeklyRevenue.map(v=>v*(0.5+Math.random()))} color={stat.color}/>
    </div>
  );
}

function OrdersPanel({orders,setOrders}){
  const[filter,setFilter]=useState("all");
  const filtered=filter==="all"?orders:orders.filter(o=>o.status===filter);
  const next=(id)=>setOrders(prev=>prev.map(o=>{if(o.id!==id)return o;return{...o,status:o.status==="pending"?"preparing":"done"};}));
  return(
    <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,overflow:"hidden"}}>
      <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <h3 style={{fontSize:14,fontWeight:900,color:"#f0f4ff",marginBottom:2}}>إدارة الطلبات</h3>
          <span style={{fontSize:11,color:"rgba(240,244,255,.35)"}}>مباشر</span>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {["all","pending","preparing","done"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className="bh" style={{fontFamily:"Cairo",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:5,border:"none",background:filter===f?"#1a4fc4":"rgba(255,255,255,.05)",color:filter===f?"#fff":"rgba(240,244,255,.5)"}}>
              {f==="all"?"الكل":f==="pending"?"انتظار":f==="preparing"?"يُحضَّر":"منجز"}
            </button>
          ))}
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table className="orders-table" style={{width:"100%",borderCollapse:"collapse",direction:"rtl"}}>
          <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            {["الرقم","الطاولة","الأصناف","المحطة","المبلغ","الوقت","الحالة","إجراء"].map(h=>(
              <th key={h} style={{padding:"11px 14px",fontSize:10,fontWeight:700,color:"rgba(240,244,255,.3)",textAlign:"right",whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((o,i)=>(
              <tr key={o.id} className="rh" style={{borderBottom:"1px solid rgba(255,255,255,.03)",animation:`fadeIn .4s ease ${i*.04}s both`}}>
                <td style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:11,color:"rgba(240,244,255,.45)"}}>{o.id}</td>
                <td style={{padding:"12px 14px"}}><span style={{fontFamily:"Space Mono",fontSize:13,fontWeight:700,color:"#f0f4ff"}}>#{o.table}</span></td>
                <td style={{padding:"12px 14px",maxWidth:180}}><span style={{fontSize:11,color:"rgba(240,244,255,.55)",lineHeight:1.5}}>{o.items.join(" · ")}</span></td>
                <td className="hide-mob" style={{padding:"12px 14px"}}><span style={{fontFamily:"Space Mono",fontSize:11,fontWeight:700,color:"#00c3ff",background:"rgba(0,195,255,.08)",padding:"3px 8px",borderRadius:5}}>{o.station}</span></td>
                <td style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:11,fontWeight:700,color:"#00ff88",whiteSpace:"nowrap"}}>{o.amount.toLocaleString()} د.ع</td>
                <td className="hide-mob" style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.35)"}}>{o.time}</td>
                <td style={{padding:"12px 14px"}}><Badge type={o.status}/></td>
                <td style={{padding:"12px 14px"}}>
                  {o.status!=="done"&&<button onClick={()=>next(o.id)} className="bh" style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,padding:"5px 11px",borderRadius:5,border:"1px solid rgba(26,79,196,.3)",background:"rgba(26,79,196,.08)",color:"#1a4fc4",cursor:"pointer",whiteSpace:"nowrap"}}>{o.status==="pending"?"→ تحضير":"→ أنجز"}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:"32px",textAlign:"center",color:"rgba(240,244,255,.2)",fontFamily:"Cairo",fontSize:13}}>لا توجد طلبات</div>}
      </div>
    </div>
  );
}

function InventoryPanel(){
  const[items,setItems]=useState(MOCK.inventory);
  const[search,setSearch]=useState("");
  const fil=items.filter(i=>i.name.includes(search));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <h3 style={{fontSize:14,fontWeight:900,color:"#f0f4ff",marginBottom:2}}>المخزون</h3>
          <span style={{fontSize:11,color:"rgba(240,244,255,.35)"}}>{items.filter(i=>i.current<=i.min).length} أصناف تحتاج طلبية</span>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 بحث..." style={{fontFamily:"Cairo",fontSize:12,padding:"7px 14px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:7,color:"#f0f4ff",outline:"none",width:160}}/>
      </div>
      {items.filter(i=>i.current<=i.min).length>0&&(
        <div style={{background:"rgba(255,214,10,.06)",border:"1px solid rgba(255,214,10,.2)",borderRadius:9,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>⚠️</span>
          <span style={{fontSize:12,color:"#ffd60a",fontWeight:700}}>{items.filter(i=>i.current<=i.min).length} أصناف وصلت للحد الأدنى — سيتم إرسال طلبيات تلقائية</span>
        </div>
      )}
      <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",direction:"rtl"}}>
            <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              {["الصنف","المتوفر","الحد الأدنى","المورد","السعر","الحالة","إجراء"].map(h=>(
                <th key={h} style={{padding:"11px 14px",fontSize:10,fontWeight:700,color:"rgba(240,244,255,.3)",textAlign:"right",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {fil.map(item=>{
                const p=item.current/item.max;
                const low=item.current<=item.min;
                const crit=item.current<=item.min*.6;
                const c=crit?"#1a4fc4":low?"#ffd60a":"#00ff88";
                return(
                  <tr key={item.id} className="rh" style={{borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                    <td style={{padding:"12px 14px"}}><span style={{fontSize:13,fontWeight:700,color:low?"#ffd60a":"#f0f4ff"}}>{item.name}</span></td>
                    <td style={{padding:"12px 14px",minWidth:130}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,height:3,background:"rgba(255,255,255,.05)",borderRadius:99,overflow:"hidden"}}>
                          <div style={{height:"100%",background:c,borderRadius:99,width:`${clamp(p*100,2,100)}%`}}/>
                        </div>
                        <span style={{fontFamily:"Space Mono",fontSize:10,color:c,whiteSpace:"nowrap"}}>{item.current} {item.unit}</span>
                      </div>
                    </td>
                    <td className="hide-mob" style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.35)"}}>{item.min} {item.unit}</td>
                    <td className="hide-mob" style={{padding:"12px 14px",fontSize:11,color:"rgba(240,244,255,.5)"}}>{item.supplier}</td>
                    <td style={{padding:"12px 14px",fontFamily:"Space Mono",fontSize:10,color:"#00c3ff",whiteSpace:"nowrap"}}>{item.cost.toLocaleString()} د.ع</td>
                    <td style={{padding:"12px 14px"}}><Badge type={crit?"warning":low?"warning":"active"}/></td>
                    <td style={{padding:"12px 14px"}}>{low&&<button className="bh" onClick={()=>setItems(prev=>prev.map(p=>p.id===item.id?{...p,current:Math.floor(p.max*.7)}:p))} style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,padding:"5px 11px",borderRadius:5,border:"1px solid rgba(255,214,10,.3)",background:"rgba(255,214,10,.08)",color:"#ffd60a",cursor:"pointer",whiteSpace:"nowrap"}}>طلب مورد</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeesPanel(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <h3 style={{fontSize:14,fontWeight:900,color:"#f0f4ff",marginBottom:2}}>الموظفون</h3>
        <span style={{fontSize:11,color:"rgba(240,244,255,.35)"}}>{MOCK.employees.filter(e=>e.status==="active").length} نشط · {MOCK.employees.filter(e=>e.status==="break").length} استراحة · {MOCK.employees.filter(e=>e.status==="off").length} غائب</span>
      </div>
      <div className="employees-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {MOCK.employees.map((emp,i)=>{
          const s=SM[emp.status];
          return(
            <div key={emp.id} className="ch" style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"18px",animation:`fadeUp .5s ease ${i*.08}s both`,opacity:emp.status==="off"?.45:1}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:`${s.c}20`,border:`1px solid ${s.c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Mono",fontSize:12,fontWeight:700,color:s.c}}>{emp.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f0f4ff"}}>{emp.name}</div>
                  <div style={{fontSize:11,color:"rgba(240,244,255,.4)"}}>{emp.role}</div>
                </div>
                <Badge type={emp.status}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {[{l:"الوردية",v:emp.shift,m:false},{l:"الطلبات",v:emp.orders,m:true},{l:"التقييم",v:`${emp.rating}%`,m:true}].map(x=>(
                  <div key={x.l} style={{background:"rgba(255,255,255,.03)",borderRadius:7,padding:"7px",textAlign:"center"}}>
                    <div style={{fontFamily:x.m?"Space Mono":"Cairo",fontSize:12,fontWeight:700,color:"#f0f4ff",marginBottom:1}}>{x.v}</div>
                    <div style={{fontSize:9,color:"rgba(240,244,255,.3)"}}>{x.l}</div>
                  </div>
                ))}
              </div>
              {emp.status!=="off"&&<div style={{height:2,background:"rgba(255,255,255,.04)",borderRadius:99,marginTop:12}}>
                <div style={{height:"100%",background:"linear-gradient(to left,#00ff88,#00c3ff)",borderRadius:99,width:`${emp.rating}%`}}/>
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsPanel(){
  const ref=useRef(null);const vis=useVis(ref);
  return(
    <div ref={ref} style={{display:"flex",flexDirection:"column",gap:18}}>
      <h3 style={{fontSize:14,fontWeight:900,color:"#f0f4ff"}}>التحليلات</h3>
      <div className="analytics-charts" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"rgba(240,244,255,.5)",marginBottom:3}}>الإيرادات الأسبوعية</div>
          <div style={{fontFamily:"Space Mono",fontSize:"clamp(18px,2.5vw,22px)",fontWeight:700,color:"#1a4fc4",marginBottom:14}}>{vis?fmt(MOCK.weeklyRevenue.reduce((a,b)=>a+b,0)):"—"} د.ع</div>
          <BarChart data={MOCK.weeklyRevenue} labels={MOCK.weekDays} color="#1a4fc4" active={vis}/>
        </div>
        <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"rgba(240,244,255,.5)",marginBottom:3}}>ساعات الذروة</div>
          <div style={{fontSize:11,color:"rgba(240,244,255,.3)",marginBottom:14}}>اليوم — 24 ساعة</div>
          <PeakHours data={MOCK.peakHours} active={vis}/>
          <div style={{marginTop:14,padding:"10px",background:"rgba(26,79,196,.06)",borderRadius:7,border:"1px solid rgba(26,79,196,.15)"}}>
            <div style={{fontSize:11,color:"#1a4fc4",fontWeight:700,marginBottom:2}}>⚡ ذروة قادمة</div>
            <div style={{fontSize:10,color:"rgba(240,244,255,.4)"}}>7:00 — 9:00 م · جهّز 3 طباخين</div>
          </div>
        </div>
      </div>
      <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"rgba(240,244,255,.5)",marginBottom:18}}>أفضل الأصناف</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {MOCK.topItems.map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.25)",width:16,textAlign:"center"}}>{i+1}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,flexWrap:"wrap",gap:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:"#f0f4ff"}}>{item.name}</span>
                  <div style={{display:"flex",gap:12}}>
                    <span style={{fontFamily:"Space Mono",fontSize:10,color:"rgba(240,244,255,.4)"}}>{item.orders} طلب</span>
                    <span style={{fontFamily:"Space Mono",fontSize:10,color:"#00ff88"}}>{item.margin}%</span>
                    <span style={{fontFamily:"Space Mono",fontSize:10,color:"#1a4fc4"}}>{fmt(item.revenue)} د.ع</span>
                  </div>
                </div>
                <div style={{height:2,background:"rgba(255,255,255,.04)",borderRadius:99}}>
                  <div style={{height:"100%",borderRadius:99,background:"linear-gradient(to left,#1a4fc4,#00c3ff)",width:vis?`${(item.orders/MOCK.topItems[0].orders)*100}%`:"0%",transition:`width 1s ease ${i*.15}s`}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel(){
  const[info,setInfo]=useState({name:"مطعم الأصيل",city:"بغداد",phone:"07700000000",email:"info@restaurant.iq",tables:"15",capacity:"60"});
  const[saved,setSaved]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18,maxWidth:600}}>
      <h3 style={{fontSize:14,fontWeight:900,color:"#f0f4ff"}}>الإعدادات</h3>
      <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
        <div className="settings-form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{l:"اسم المطعم",k:"name"},{l:"المدينة",k:"city"},{l:"رقم الهاتف",k:"phone"},{l:"البريد",k:"email",t:"email"},{l:"عدد الطاولات",k:"tables",t:"number"},{l:"الطاقة الاستيعابية",k:"capacity",t:"number"}].map(f=>(
            <div key={f.k}>
              <label style={{fontSize:11,fontWeight:700,color:"rgba(240,244,255,.4)",display:"block",marginBottom:6}}>{f.l}</label>
              <input type={f.t||"text"} value={info[f.k]} onChange={e=>setInfo(p=>({...p,[f.k]:e.target.value}))}
                style={{width:"100%",fontFamily:"Cairo",fontSize:13,padding:"10px 13px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:7,color:"#f0f4ff",outline:"none"}}
                onFocus={e=>e.target.style.borderColor="#1a4fc4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
            </div>
          ))}
        </div>
      </div>
      <button className="bh" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);}} style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,padding:"11px 28px",borderRadius:7,border:"none",cursor:"pointer",background:saved?"#00ff88":"#1a4fc4",color:saved?"#000":"#fff",boxShadow:saved?"0 0 16px rgba(0,255,136,.4)":"0 0 16px rgba(26,79,196,.3)",transition:"all .3s",alignSelf:"flex-start"}}>
        {saved?"✓ تم الحفظ":"حفظ الإعدادات"}
      </button>
    </div>
  );
}

const NAV=[{id:"overview",icon:"⬡",l:"نظرة عامة"},{id:"orders",icon:"🧾",l:"الطلبات"},{id:"inventory",icon:"📦",l:"المخزون"},{id:"employees",icon:"👥",l:"الموظفون"},{id:"analytics",icon:"📊",l:"التحليلات"},{id:"settings",icon:"⚙️",l:"الإعدادات"}];

function Sidebar({active,setActive,collapsed,setCollapsed}){
  return(
    <aside className="dash-sidebar" style={{width:collapsed?56:210,background:"#030d1a",borderLeft:"1px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column",transition:"width .3s cubic-bezier(.4,0,.2,1)",flexShrink:0,position:"sticky",top:0,height:"100vh",overflow:"hidden",zIndex:50}}>
      <div style={{padding:"18px 14px",borderBottom:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(c=>!c)}>
        <div style={{width:32,height:32,borderRadius:7,background:"linear-gradient(135deg,#1a4fc4,#00c3ff)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Mono",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>IQ</div>
        <span className="logo-text" style={{fontFamily:"Space Mono",fontSize:12,fontWeight:700,color:"#f0f4ff",whiteSpace:"nowrap"}}>IQR <span style={{color:"#1a4fc4",fontSize:9}}>داشبورد</span></span>
      </div>
      <nav style={{flex:1,padding:"10px 7px",display:"flex",flexDirection:"column",gap:2}}>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setActive(item.id)} className={`ni${active===item.id?" active":""}`}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:7,border:"none",background:"transparent",cursor:"pointer",color:active===item.id?"#f0f4ff":"rgba(240,244,255,.4)",textAlign:"right",direction:"rtl",position:"relative"}}>
            <span style={{fontSize:16,flexShrink:0,lineHeight:1}}>{item.icon}</span>
            <span className="nav-label" style={{fontFamily:"Cairo",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{item.l}</span>
            {active===item.id&&<div style={{position:"absolute",right:0,top:"20%",bottom:"20%",width:2,background:"#1a4fc4",borderRadius:99}}/>}
          </button>
        ))}
      </nav>
      <div style={{padding:"14px",borderTop:"1px solid rgba(255,255,255,.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:"rgba(26,79,196,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Mono",fontSize:9,color:"#1a4fc4",flexShrink:0}}>AD</div>
          <div className="user-info">
            <div style={{fontSize:11,fontWeight:700,color:"#f0f4ff"}}>المدير</div>
            <a href="/" style={{fontSize:9,color:"rgba(240,244,255,.3)",textDecoration:"none"}}>الرئيسية</a>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({activePage,showNotif,setShowNotif}){
  const[time,setTime]=useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(id);},[]);
  const labels={overview:"نظرة عامة",orders:"الطلبات",inventory:"المخزون",employees:"الموظفون",analytics:"التحليلات",settings:"الإعدادات"};
  return(
    <header className="dash-topbar" style={{height:56,background:"rgba(3,13,26,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",position:"sticky",top:0,zIndex:100,direction:"rtl"}}>
      <div>
        <h1 style={{fontSize:14,fontWeight:900,color:"#f0f4ff",lineHeight:1}}>{labels[activePage]}</h1>
        <span style={{fontSize:10,color:"rgba(240,244,255,.3)"}}>IQR — لوحة التحكم</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span className="hide-mob" style={{fontFamily:"Space Mono",fontSize:11,color:"rgba(240,244,255,.3)"}}>{time.toLocaleTimeString("ar-IQ",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
        <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,255,136,.08)",border:"1px solid rgba(0,255,136,.2)",borderRadius:99,padding:"3px 10px"}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",animation:"pulse 1.5s infinite"}}/>
          <span style={{fontFamily:"Cairo",fontSize:10,fontWeight:700,color:"#00ff88"}}>مباشر</span>
        </div>
        <button onClick={()=>setShowNotif(v=>!v)} style={{position:"relative",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:7,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
          🔔<span style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#1a4fc4",border:"2px solid #030d1a",animation:"pulse 2s infinite"}}/>
        </button>
      </div>
    </header>
  );
}

function NotifPanel({onClose}){
  return(
    <div className="dash-notif-panel" style={{position:"fixed",top:60,left:20,width:340,background:"#0a1628",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,boxShadow:"0 20px 60px rgba(0,0,0,.6)",zIndex:200,overflow:"hidden",animation:"fadeUp .25s ease"}}>
      <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,fontWeight:900,color:"#f0f4ff"}}>الإشعارات</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(240,244,255,.4)",cursor:"pointer",fontSize:17,lineHeight:1}}>×</button>
      </div>
      {MOCK.notifications.map((n,i)=>{const s=SM[n.type];return(
        <div key={n.id} style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,.04)",background:i%2===0?"rgba(255,255,255,.01)":"transparent"}}>
          <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:s.c,marginTop:5,flexShrink:0}}/>
            <div>
              <div style={{fontSize:11,color:"rgba(240,244,255,.7)",lineHeight:1.6,marginBottom:3}}>{n.msg}</div>
              <div style={{fontSize:9,color:"rgba(240,244,255,.25)"}}>{n.time}</div>
            </div>
          </div>
        </div>
      );})}
    </div>
  );
}

function OverviewPage({orders,setOrders}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {MOCK.stats.map((s,i)=><StatCard key={s.id} stat={s} idx={i}/>)}
      </div>
      <div className="overview-charts" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:"rgba(240,244,255,.5)"}}>الإيرادات الأسبوعية</div>
              <div style={{fontFamily:"Space Mono",fontSize:"clamp(16px,2.5vw,20px)",fontWeight:700,color:"#1a4fc4",marginTop:3}}>{fmt(MOCK.weeklyRevenue.reduce((a,b)=>a+b,0))} د.ع</div>
            </div>
            <span style={{fontSize:11,color:"#00ff88",background:"rgba(0,255,136,.08)",padding:"3px 10px",borderRadius:99,fontWeight:700}}>+19% ↑</span>
          </div>
          <BarChart data={MOCK.weeklyRevenue} labels={MOCK.weekDays} color="#1a4fc4" active={true}/>
        </div>
        <div style={{background:"#0a1628",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"22px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"rgba(240,244,255,.5)",marginBottom:3}}>ساعات الذروة</div>
          <div style={{fontSize:10,color:"rgba(240,244,255,.3)",marginBottom:14}}>اليوم — 24 ساعة</div>
          <PeakHours data={MOCK.peakHours} active={true}/>
          <div style={{marginTop:12,padding:"10px",background:"rgba(26,79,196,.06)",borderRadius:7,border:"1px solid rgba(26,79,196,.15)"}}>
            <div style={{fontSize:10,color:"#1a4fc4",fontWeight:700,marginBottom:2}}>⚡ ذروة قادمة</div>
            <div style={{fontSize:10,color:"rgba(240,244,255,.4)"}}>7:00 — 9:00 م · 3 طباخين</div>
          </div>
        </div>
      </div>
      <OrdersPanel orders={orders.slice(0,5)} setOrders={setOrders}/>
    </div>
  );
}

export default function IQRDashboard(){
  const[activePage,setActivePage]=useState("overview");
  const[collapsed,setCollapsed]=useState(false);
  const[showNotif,setShowNotif]=useState(false);
  const[orders,setOrders]=useState(MOCK.orders);

  useEffect(()=>{
    const id=setInterval(()=>{
      const tables=[2,4,6,10,11];
      const items=[["برغر دبل","كولا"],["شاورما دجاج"],["بيتزا","ماء"],["كباب","خبز"]];
      setOrders(prev=>[{
        id:`ORD-${440+Math.floor(Math.random()*100)}`,
        table:tables[Math.floor(Math.random()*tables.length)],
        items:items[Math.floor(Math.random()*items.length)],
        status:"pending",
        time:new Date().toLocaleTimeString("ar-IQ",{hour:"2-digit",minute:"2-digit"}),
        amount:Math.floor(8000+Math.random()*22000),
        station:["A","B","C"][Math.floor(Math.random()*3)],
      },...prev.slice(0,18)]);
    },12000);
    return()=>clearInterval(id);
  },[]);

  const renderPage=()=>{
    switch(activePage){
      case "overview":   return <OverviewPage orders={orders} setOrders={setOrders}/>;
      case "orders":     return <OrdersPanel orders={orders} setOrders={setOrders}/>;
      case "inventory":  return <InventoryPanel/>;
      case "employees":  return <EmployeesPanel/>;
      case "analytics":  return <AnalyticsPanel/>;
      case "settings":   return <SettingsPanel/>;
      default:           return <OverviewPage orders={orders} setOrders={setOrders}/>;
    }
  };

  return(
    <>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(26,79,196,.06),transparent 70%)",top:0,right:0,animation:"orb 15s ease-in-out infinite",filter:"blur(60px)"}}/>
      </div>
      <div style={{display:"flex",height:"100vh",direction:"rtl",position:"relative",zIndex:1,overflow:"hidden"}}>
        <Sidebar active={activePage} setActive={setActivePage} collapsed={collapsed} setCollapsed={setCollapsed}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <TopBar activePage={activePage} showNotif={showNotif} setShowNotif={setShowNotif}/>
          <main className="dash-main" style={{flex:1,overflowY:"auto",padding:"20px",animation:"fadeIn .4s ease"}}>
            {renderPage()}
          </main>
        </div>
      </div>
      {showNotif&&<NotifPanel onClose={()=>setShowNotif(false)}/>}
    </>
  );
}
