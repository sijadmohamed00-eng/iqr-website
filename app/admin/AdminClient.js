"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "../../lib/supabase";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{background:#000814;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .row-hover{transition:background .15s}
  .row-hover:hover{background:rgba(26,79,196,.04)!important}
  .btn{transition:all .2s;cursor:pointer;border:none;font-family:'Cairo',sans-serif;font-weight:700;}
  .btn:hover{transform:translateY(-1px);filter:brightness(1.1);}
  .field input,.field select{
    width:100%;font-family:'Cairo',sans-serif;font-size:14px;
    padding:11px 14px;background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.08);border-radius:8px;
    color:#f0f4ff;outline:none;transition:all .2s;
  }
  .field input:focus,.field select:focus{border-color:#1a4fc4;box-shadow:0 0 0 3px rgba(26,79,196,.1);}
  .field input::placeholder{color:rgba(240,244,255,.2);}

  /* MOBILE RESPONSIVE */
  @media(max-width:768px){
    .admin-header{flex-direction:column!important;gap:12px!important;padding:16px!important;}
    .admin-grid{grid-template-columns:1fr!important;}
    .admin-table{font-size:12px!important;}
    .admin-table th,.admin-table td{padding:10px 10px!important;}
    .hide-mobile{display:none!important;}
    .admin-main{padding:16px!important;}
    .admin-form-grid{grid-template-columns:1fr!important;}
  }
`;

export default function AdminClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [tab, setTab] = useState("subscribers");
  const [form, setForm] = useState({ email: "", password: "", restaurant: "", phone: "", city: "", months: "1" });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0 });

  // Verify admin
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();

      if (profile?.role !== "admin") { router.push("/"); return; }

      await loadSubscribers();
      setLoading(false);
    })();
  }, []);

  const loadSubscribers = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select(`*, profiles(email, restaurant_name, phone, city)`)
      .order("created_at", { ascending: false });

    if (data) {
      setSubscribers(data);
      setStats({
        total: data.length,
        active: data.filter(s => s.status === "active" && new Date(s.expires_at) > new Date()).length,
        expired: data.filter(s => s.status !== "active" || new Date(s.expires_at) <= new Date()).length,
      });
    }
  };

  const createSubscriber = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg("");

    try {
      // 1. Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true,
        user_metadata: { restaurant_name: form.restaurant, phone: form.phone, city: form.city },
      });
      if (authError) throw authError;

      // 2. Update profile
      await supabase.from("profiles").update({
        restaurant_name: form.restaurant,
        phone: form.phone,
        city: form.city,
      }).eq("id", authData.user.id);

      // 3. Create subscription
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + parseInt(form.months));
      await supabase.from("subscriptions").insert({
        user_id: authData.user.id,
        plan: "bronze",
        status: "active",
        expires_at: expiresAt.toISOString(),
      });

      setCreateMsg(`✅ تم إنشاء حساب ${form.email} بنجاح! مدة الاشتراك: ${form.months} شهر`);
      setForm({ email: "", password: "", restaurant: "", phone: "", city: "", months: "1" });
      await loadSubscribers();
    } catch (err) {
      setCreateMsg(`❌ خطأ: ${err.message}`);
    }
    setCreating(false);
  };

  const toggleStatus = async (sub) => {
    const newStatus = sub.status === "active" ? "cancelled" : "active";
    await supabase.from("subscriptions").update({ status: newStatus }).eq("id", sub.id);
    await loadSubscribers();
  };

  const extendSub = async (sub, months) => {
    const current = new Date(sub.expires_at) > new Date() ? new Date(sub.expires_at) : new Date();
    current.setMonth(current.getMonth() + months);
    await supabase.from("subscriptions").update({
      expires_at: current.toISOString(),
      status: "active",
    }).eq("id", sub.id);
    await loadSubscribers();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000814" }}>
      <div style={{ fontFamily: "Cairo", fontSize: 16, color: "rgba(240,244,255,.4)" }}>جاري التحميل...</div>
    </div>
  );

  const isActive = (sub) => sub.status === "active" && new Date(sub.expires_at) > new Date();
  const daysLeft = (date) => Math.max(0, Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <>
      <style>{G}</style>
      <div style={{ minHeight: "100vh", background: "#000814", direction: "rtl" }}>

        {/* HEADER */}
        <header className="admin-header" style={{ background: "rgba(3,13,26,.95)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/" style={{ fontFamily: "Space Mono", fontSize: 18, fontWeight: 700, color: "#f0f4ff", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, background: "#1a4fc4", borderRadius: "50%", animation: "blink 2s infinite" }} />IQR
            </a>
            <div style={{ height: 20, width: 1, background: "rgba(255,255,255,.1)" }} />
            <span style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: "#1a4fc4" }}>لوحة الأدمن</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.3)" }}>مرحباً، أدمن</span>
            <button className="btn" onClick={handleSignOut} style={{ fontSize: 12, padding: "7px 16px", background: "rgba(255,80,80,.1)", color: "#ff6b6b", border: "1px solid rgba(255,80,80,.2)", borderRadius: 6 }}>
              خروج
            </button>
          </div>
        </header>

        {/* STATS */}
        <div style={{ padding: "24px 32px 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 900 }}>
          {[
            { label: "إجمالي المشتركين", value: stats.total, color: "#1a4fc4", icon: "👥" },
            { label: "اشتراكات نشطة", value: stats.active, color: "#00ff88", icon: "✅" },
            { label: "اشتراكات منتهية", value: stats.expired, color: "#ffd60a", icon: "⏰" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "Space Mono", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.4)" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ padding: "24px 32px 0" }}>
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,.06)", paddingBottom: 0 }}>
            {[
              { id: "subscribers", label: "المشتركون" },
              { id: "create", label: "إنشاء مشترك جديد" },
            ].map(t => (
              <button key={t.id} className="btn" onClick={() => setTab(t.id)} style={{
                fontSize: 13, padding: "10px 20px", borderRadius: "8px 8px 0 0",
                background: tab === t.id ? "#0a1628" : "transparent",
                color: tab === t.id ? "#f0f4ff" : "rgba(240,244,255,.4)",
                borderBottom: tab === t.id ? "2px solid #1a4fc4" : "2px solid transparent",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="admin-main" style={{ padding: "24px 32px" }}>

          {/* TAB: SUBSCRIBERS */}
          {tab === "subscribers" && (
            <div style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "Cairo", fontSize: 15, fontWeight: 900, color: "#f0f4ff" }}>قائمة المشتركين</h3>
                <button className="btn" onClick={loadSubscribers} style={{ fontSize: 12, padding: "6px 14px", background: "rgba(26,79,196,.1)", color: "#1a4fc4", border: "1px solid rgba(26,79,196,.2)", borderRadius: 6 }}>
                  🔄 تحديث
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                      {["الإيميل", "المطعم", "الهاتف", "المدينة", "ينتهي", "الحالة", "إجراءات"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,.3)", textAlign: "right", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "rgba(240,244,255,.2)", fontFamily: "Cairo" }}>لا يوجد مشتركون بعد</td></tr>
                    ) : subscribers.map((sub) => {
                      const active = isActive(sub);
                      const days = daysLeft(sub.expires_at);
                      return (
                        <tr key={sub.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                          <td style={{ padding: "14px 16px", fontFamily: "Space Mono", fontSize: 12, color: "#f0f4ff", direction: "ltr" }}>{sub.profiles?.email || "—"}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(240,244,255,.7)" }}>{sub.profiles?.restaurant_name || "—"}</td>
                          <td className="hide-mobile" style={{ padding: "14px 16px", fontFamily: "Space Mono", fontSize: 11, color: "rgba(240,244,255,.5)", direction: "ltr" }}>{sub.profiles?.phone || "—"}</td>
                          <td className="hide-mobile" style={{ padding: "14px 16px", fontSize: 12, color: "rgba(240,244,255,.5)" }}>{sub.profiles?.city || "—"}</td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ fontFamily: "Space Mono", fontSize: 11, color: days <= 7 ? "#ffd60a" : "rgba(240,244,255,.5)" }}>
                              {days > 0 ? `${days} يوم` : "منتهي"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, color: active ? "#00ff88" : "#ff6b6b", background: active ? "rgba(0,255,136,.1)" : "rgba(255,80,80,.1)" }}>
                              {active ? "نشط" : "منتهي"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <button className="btn" onClick={() => extendSub(sub, 1)} style={{ fontSize: 11, padding: "5px 10px", background: "rgba(0,255,136,.08)", color: "#00ff88", border: "1px solid rgba(0,255,136,.2)", borderRadius: 5 }}>+شهر</button>
                              <button className="btn" onClick={() => extendSub(sub, 3)} style={{ fontSize: 11, padding: "5px 10px", background: "rgba(26,79,196,.08)", color: "#1a4fc4", border: "1px solid rgba(26,79,196,.2)", borderRadius: 5 }}>+3 أشهر</button>
                              <button className="btn" onClick={() => toggleStatus(sub)} style={{ fontSize: 11, padding: "5px 10px", background: active ? "rgba(255,80,80,.08)" : "rgba(0,195,255,.08)", color: active ? "#ff6b6b" : "#00c3ff", border: `1px solid ${active ? "rgba(255,80,80,.2)" : "rgba(0,195,255,.2)"}`, borderRadius: 5 }}>
                                {active ? "إيقاف" : "تفعيل"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CREATE */}
          {tab === "create" && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: "28px" }}>
                <h3 style={{ fontFamily: "Cairo", fontSize: 16, fontWeight: 900, color: "#f0f4ff", marginBottom: 24 }}>إنشاء مشترك جديد</h3>
                <form onSubmit={createSubscriber} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[
                      { label: "الإيميل *", key: "email", type: "email", ph: "example@email.com" },
                      { label: "كلمة المرور *", key: "password", type: "password", ph: "كلمة مرور قوية" },
                      { label: "اسم المطعم", key: "restaurant", type: "text", ph: "مطعم الأصيل" },
                      { label: "رقم الهاتف", key: "phone", type: "tel", ph: "07XXXXXXXXX" },
                      { label: "المدينة", key: "city", type: "text", ph: "بغداد" },
                    ].map(f => (
                      <div key={f.key} className="field">
                        <label style={{ fontFamily: "Cairo", fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,.4)", display: "block", marginBottom: 6 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.label.includes("*")} />
                      </div>
                    ))}
                    <div className="field">
                      <label style={{ fontFamily: "Cairo", fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,.4)", display: "block", marginBottom: 6 }}>مدة الاشتراك</label>
                      <select value={form.months} onChange={e => setForm(p => ({ ...p, months: e.target.value }))} style={{ width: "100%", fontFamily: "Cairo", fontSize: 14, padding: "11px 14px", background: "#0a1628", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, color: "#f0f4ff", outline: "none" }}>
                        <option value="1">شهر واحد</option>
                        <option value="3">3 أشهر</option>
                        <option value="6">6 أشهر</option>
                        <option value="12">سنة كاملة</option>
                      </select>
                    </div>
                  </div>
                  {createMsg && (
                    <div style={{ background: createMsg.includes("✅") ? "rgba(0,255,136,.06)" : "rgba(255,80,80,.06)", border: `1px solid ${createMsg.includes("✅") ? "rgba(0,255,136,.2)" : "rgba(255,80,80,.2)"}`, borderRadius: 8, padding: "12px 16px" }}>
                      <span style={{ fontFamily: "Cairo", fontSize: 13, color: createMsg.includes("✅") ? "#00ff88" : "#ff6b6b" }}>{createMsg}</span>
                    </div>
                  )}
                  <button type="submit" disabled={creating} className="btn" style={{ fontSize: 14, padding: "13px", background: "#1a4fc4", color: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 0 20px rgba(26,79,196,.3)" }}>
                    {creating ? (
                      <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />جاري الإنشاء...</>
                    ) : "✅ إنشاء الحساب والاشتراك"}
                  </button>
                </form>
              </div>

              {/* Instructions */}
              <div style={{ marginTop: 16, background: "rgba(26,79,196,.06)", border: "1px solid rgba(26,79,196,.15)", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: "#1a4fc4", marginBottom: 10 }}>📋 بعد الإنشاء</div>
                <div style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.5)", lineHeight: 1.9 }}>
                  1. أرسل للمشترك الإيميل وكلمة المرور عبر واتساب<br />
                  2. رابط تسجيل الدخول: <span style={{ fontFamily: "Space Mono", color: "#00c3ff", direction: "ltr" }}>iqrhq.me/login</span><br />
                  3. عند الدخول ستظهر له المدونة والداشبورد تلقائياً
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
