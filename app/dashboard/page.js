"use client";
import dynamic from "next/dynamic";
import { DashboardGate } from "../../subscription/SubscriptionGate";
const D=dynamic(()=>import("../../components/IQRDashboard"),{ssr:false,loading:()=><div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000814"}}><div style={{fontFamily:"Cairo",fontSize:15,color:"rgba(240,244,255,.35)"}}>جاري التحميل...</div></div>});
export default function P(){return <DashboardGate><D/></DashboardGate>;}
