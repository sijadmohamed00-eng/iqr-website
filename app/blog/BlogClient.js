"use client";
import { useState, useEffect, useRef } from "react";
import { POSTS_LIST, FREE_SLUGS } from "../../lib/posts";
import { useSubscription } from "../../subscription/SubscriptionGate";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .card-hover{transition:transform .25s,box-shadow .25s}
  .card-hover:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(26,79,196,.18)!important}
  .tag{display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:700}
  .filter-btn{transition:all .2s;cursor:pointer;border:none;font-family:'Cairo',sans-serif}

  /* ═══ RESPONSIVE ═══ */
  @media(max-width:768px){
    .blog-nav{padding:16px 20px!important}
    .blog-nav-links{display:none!important}
    .blog-nav-mobile-btn{display:flex!important}
    .mobile-menu{display:flex!important}
    .blog-hero{padding:100px 20px 48px!important}
    .blog-hero h1{font-size:clamp(32px,8vw,56px)!important}
    .featured-grid{grid-template-columns:1fr!important;gap:24px!important;padding:0 20px 40px!important}
    .posts-grid{grid-template-columns:1fr!important;padding:0 20px 60px!important}
    .subscribe-banner{flex-direction:column!important;gap:16px!important;padding:20px!important;margin:0 20px 32px!important}
    .filter-row{padding:0 20px 24px!important;gap:6px!important}
    .filter-btn{padding:6px 14px!important;font-size:11px!important}
    .blog-footer{padding:28px 20px!important}
    .featured-card-inner{padding:28px 20px!important}
    .featured-points{display:none!important}
  }
  @media(max-width:480px){
    .blog-hero h1{font-size:28px!important}
    .blog-hero p{font-size:14px!important}
    .hero-cta{flex-direction:column!important;align-items:stretch!important}
    .hero-cta a{text-align:center!important}
  }
`;

function useVisible(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: .08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return v;
}

function Nav({ subscribed, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav className="blog-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(0,8,20,.97)" : "rgba(0,8,20,.6)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "all .4s", direction: "rtl" }}>
        <a href="/" style={{ fontFamily: "Space Mono", fontSize: 18, fontWeight: 700, color: "#f0f4ff", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, background: "#1a4fc4", borderRadius: "50%", animation: "blink 2s infinite" }} />
          IQR
        </a>
        {/* Desktop nav */}
        <div className="blog-nav-links" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {[{ h: "/", l: "الرئيسية" }, { h: "/about/", l: "من نحن" }, { h: "/blog/", l: "المدونة" }, { h: "/contact/", l: "تواصل" }].map(n => (
            <a key={n.h} href={n.h} style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: n.h === "/blog/" ? "#1a4fc4" : "rgba(240,244,255,.5)", textDecoration: "none", transition: "color .3s" }}
              onMouseEnter={e => e.target.style.color = "#f0f4ff"} onMouseLeave={e => e.target.style.color = n.h === "/blog/" ? "#1a4fc4" : "rgba(240,244,255,.5)"}>{n.l}</a>
          ))}
          {user ? (
            <a href="/dashboard/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "7px 18px", background: "rgba(0,255,136,.1)", color: "#00ff88", border: "1px solid rgba(0,255,136,.2)", borderRadius: 6, textDecoration: "none" }}>
              📊 الداشبورد
            </a>
          ) : (
            <a href="/login/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "7px 18px", background: "rgba(26,79,196,.15)", color: "#1a4fc4", border: "1px solid rgba(26,79,196,.25)", borderRadius: 6, textDecoration: "none" }}>
              🔐 دخول
            </a>
          )}
          <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "7px 18px", background: "rgba(205,127,50,.15)", color: "#cd7f32", border: "1px solid rgba(205,127,50,.3)", borderRadius: 6, textDecoration: "none" }}>🔑 اشترك</a>
        </div>
        {/* Mobile hamburger */}
        <button className="blog-nav-mobile-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }} onClick={() => setMobileOpen(v => !v)}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: 24, height: 2, background: "#f0f4ff", borderRadius: 2, display: "block", transition: "all .3s", transform: mobileOpen && i === 0 ? "rotate(45deg) translateY(7px)" : mobileOpen && i === 2 ? "rotate(-45deg) translateY(-7px)" : "none", opacity: mobileOpen && i === 1 ? 0 : 1 }} />)}
        </button>
      </nav>
      {/* Mobile menu */}
      <div className="mobile-menu" style={{ display: "none", position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: "rgba(0,8,20,.98)", borderBottom: "1px solid rgba(255,255,255,.08)", flexDirection: "column", padding: "20px 24px", gap: 4, backdropFilter: "blur(20px)", transform: mobileOpen ? "translateY(0)" : "translateY(-20px)", opacity: mobileOpen ? 1 : 0, transition: "all .3s", pointerEvents: mobileOpen ? "all" : "none" }}>
        {[{ h: "/", l: "الرئيسية" }, { h: "/about/", l: "من نحن" }, { h: "/blog/", l: "المدونة" }, { h: "/contact/", l: "تواصل" }].map(n => (
          <a key={n.h} href={n.h} style={{ fontFamily: "Cairo", fontSize: 15, fontWeight: 700, color: "rgba(240,244,255,.7)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>{n.l}</a>
        ))}
        <div style={{ display: "flex", gap: 10, paddingTop: 12 }}>
          <a href="/login/" style={{ flex: 1, fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "11px", background: "rgba(26,79,196,.15)", color: "#1a4fc4", border: "1px solid rgba(26,79,196,.25)", borderRadius: 8, textDecoration: "none", textAlign: "center" }}>🔐 دخول</a>
          <a href="/pricing/" style={{ flex: 1, fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "11px", background: "rgba(205,127,50,.15)", color: "#cd7f32", border: "1px solid rgba(205,127,50,.3)", borderRadius: 8, textDecoration: "none", textAlign: "center" }}>🔑 اشترك</a>
        </div>
      </div>
    </>
  );
}

function PostCard({ post, idx, subscribed }) {
  const ref = useRef(null);
  const visible = useVisible(ref);
  const isFree = FREE_SLUGS.includes(post.slug);
  const locked = !subscribed && !isFree;

  return (
    <div ref={ref} className="card-hover" style={{
      background: "#0a1628", border: `1px solid ${locked ? "rgba(205,127,50,.12)" : "rgba(255,255,255,.05)"}`,
      borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column",
      opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)",
      transition: `opacity .6s ease ${(idx % 3) * .08}s, transform .6s ease ${(idx % 3) * .08}s`,
      position: "relative",
    }}>
      {/* Badge */}
      {locked && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: "rgba(205,127,50,.15)", border: "1px solid rgba(205,127,50,.3)", borderRadius: 99, padding: "3px 10px", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10 }}>🔒</span>
          <span style={{ fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: "#cd7f32" }}>مشتركين</span>
        </div>
      )}
      {isFree && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: "rgba(0,255,136,.1)", border: "1px solid rgba(0,255,136,.25)", borderRadius: 99, padding: "3px 10px" }}>
          <span style={{ fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: "#00ff88" }}>مجاني ✓</span>
        </div>
      )}
      {post.featured && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, background: "rgba(26,79,196,.15)", border: "1px solid rgba(26,79,196,.3)", borderRadius: 99, padding: "3px 10px" }}>
          <span style={{ fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: "#1a4fc4" }}>⭐ مميز</span>
        </div>
      )}

      <div style={{ padding: "28px 24px 0", flex: 1, marginTop: isFree || locked || post.featured ? 16 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span className="tag" style={{ background: `${post.categoryColor}15`, color: post.categoryColor, border: `1px solid ${post.categoryColor}30` }}>{post.category}</span>
          <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "rgba(240,244,255,.25)" }}>{post.readTime}</span>
        </div>
        <div style={{ fontSize: 28, marginBottom: 12, filter: locked ? "grayscale(.7)" : "none" }}>{post.icon}</div>
        <h2 style={{ fontFamily: "Cairo", fontSize: 16, fontWeight: 900, color: locked ? "rgba(240,244,255,.45)" : "#f0f4ff", lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h2>
        <p style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.4)", lineHeight: 1.8, marginBottom: 16 }}>
          {locked ? "اشترك في الخطة البرونزية للوصول لهذا المقال." : post.excerpt}
        </p>
        {!locked && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {post.tags.map(t => (<span key={t} className="tag" style={{ background: "rgba(255,255,255,.04)", color: "rgba(240,244,255,.35)", border: "1px solid rgba(255,255,255,.06)" }}>#{t}</span>))}
          </div>
        )}
      </div>
      <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Cairo", fontSize: 11, color: "rgba(240,244,255,.2)" }}>{post.date}</span>
        {locked ? (
          <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 12, fontWeight: 700, color: "#cd7f32", textDecoration: "none" }}>🔑 اشترك ←</a>
        ) : (
          <a href={`/blog/${post.slug}/`} style={{ fontFamily: "Cairo", fontSize: 12, fontWeight: 700, color: "#1a4fc4", textDecoration: "none" }}>اقرأ المقال ←</a>
        )}
      </div>
    </div>
  );
}

export default function BlogClient() {
  const { subscribed, user } = useSubscription();
  const [filter, setFilter] = useState("الكل");
  const featuredPost = POSTS_LIST[0]; // الكول سنتر أول
  const featuredRef = useRef(null);
  const featuredVisible = useVisible(featuredRef);
  const categories = ["الكل", ...Array.from(new Set(POSTS_LIST.map(p => p.category)))];
  const filtered = filter === "الكل" ? POSTS_LIST : POSTS_LIST.filter(p => p.category === filter);

  return (
    <>
      <style>{G}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(26,79,196,.08),transparent 70%)", top: "-10%", right: "-5%", animation: "orb 15s ease-in-out infinite", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,195,255,.05),transparent 70%)", bottom: "10%", left: "-5%", animation: "orb 20s ease-in-out infinite reverse", filter: "blur(80px)" }} />
      </div>
      <Nav subscribed={subscribed} user={user} />

      {/* HERO */}
      <section className="blog-hero" style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 48px 60px", textAlign: "center", position: "relative", zIndex: 2, direction: "rtl" }}>
        <div style={{ animation: "fadeUp 1s ease both", maxWidth: 640 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".4em", color: "#1a4fc4", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "Cairo" }}>
            <span style={{ flex: 1, maxWidth: 50, height: 1, background: "linear-gradient(to right,transparent,#1a4fc4)" }} />المدونة
            <span style={{ flex: 1, maxWidth: 50, height: 1, background: "linear-gradient(to left,transparent,#1a4fc4)" }} />
          </div>
          <h1 style={{ fontFamily: "Cairo", fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, lineHeight: .95, marginBottom: 20, color: "#f0f4ff" }}>
            معرفة تبني<br /><em style={{ fontStyle: "normal", color: "#1a4fc4" }}>مطاعم ناجحة</em>
          </h1>
          <p style={{ fontFamily: "Cairo", fontSize: 16, color: "rgba(240,244,255,.45)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.8 }}>
            مقالات عملية من خبرة حقيقية في إدارة المطاعم في العراق
          </p>
          {!subscribed && (
            <div className="hero-cta" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/login/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "10px 24px", background: "rgba(26,79,196,.15)", color: "#1a4fc4", border: "1px solid rgba(26,79,196,.25)", borderRadius: 8, textDecoration: "none" }}>🔐 تسجيل الدخول</a>
              <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "10px 24px", background: "linear-gradient(135deg,#cd7f32,#f5c874)", color: "#000", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 20px rgba(205,127,50,.3)" }}>🔑 اشترك — $100/شهر</a>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED — الكول سنتر */}
      <section ref={featuredRef} className="featured-grid" style={{ padding: "0 48px 56px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2, direction: "rtl" }}>
        <div style={{
          background: "linear-gradient(135deg,#0a1628,#0d1f3d)", border: "1px solid rgba(0,195,255,.2)", borderRadius: 18,
          overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          opacity: featuredVisible ? 1 : 0, transform: featuredVisible ? "none" : "translateY(30px)", transition: "all .9s ease",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right,#00c3ff,#1a4fc4,#00c3ff)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
          <div className="featured-card-inner" style={{ padding: "44px 40px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
              <span className="tag" style={{ background: "rgba(0,195,255,.12)", color: "#00c3ff", border: "1px solid rgba(0,195,255,.25)" }}>⭐ مقال مميز</span>
              <span style={{ fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,.1)", border: "1px solid rgba(0,255,136,.2)", borderRadius: 99, padding: "2px 8px" }}>مجاني</span>
              <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "rgba(240,244,255,.25)" }}>12 دقيقة</span>
            </div>
            <div style={{ fontSize: 44, marginBottom: 16 }}>{featuredPost.icon}</div>
            <h2 style={{ fontFamily: "Cairo", fontSize: "clamp(18px,2.5vw,28px)", fontWeight: 900, color: "#f0f4ff", lineHeight: 1.25, marginBottom: 14 }}>{featuredPost.title}</h2>
            <p style={{ fontFamily: "Cairo", fontSize: 14, color: "rgba(240,244,255,.45)", lineHeight: 1.8, marginBottom: 28 }}>{featuredPost.excerpt}</p>
            <a href={`/blog/${featuredPost.slug}/`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "13px 28px", background: "#00c3ff", color: "#000", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 24px rgba(0,195,255,.3)" }}>
              اقرأ المقال الكامل ←
            </a>
          </div>
          <div className="featured-points" style={{ padding: "44px 40px", borderRight: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
            {[
              { icon: "📞", text: "بناء نظام استقبال احترافي" },
              { icon: "📊", text: "قياس أداء الكول سنتر بالأرقام" },
              { icon: "🎯", text: "سكريبت الرد المثالي" },
              { icon: "💰", text: "زيادة الطلبات +60% مضمونة" },
              { icon: "⚡", text: "خطة تطبيق خلال 4 أسابيع" },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", background: "rgba(0,195,255,.04)", borderRadius: 10, border: "1px solid rgba(0,195,255,.08)" }}>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <span style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,.65)" }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION BANNER */}
      {!subscribed && (
        <section style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2, direction: "rtl" }}>
          <div className="subscribe-banner" style={{ background: "linear-gradient(135deg,rgba(205,127,50,.08),rgba(205,127,50,.03))", border: "1px solid rgba(205,127,50,.2)", borderRadius: 12, padding: "20px 28px", margin: "0 48px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 24 }}>🔑</span>
              <div>
                <div style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 900, color: "#f0f4ff", marginBottom: 3 }}>المقال الأول مجاني — باقي المقالات للمشتركين</div>
                <div style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.4)" }}>اشترك للوصول الكامل + الداشبورد</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <a href="/login/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "9px 20px", background: "rgba(26,79,196,.15)", color: "#1a4fc4", border: "1px solid rgba(26,79,196,.25)", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap" }}>دخول</a>
              <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "9px 20px", background: "linear-gradient(135deg,#cd7f32,#f5c874)", color: "#000", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap" }}>اشترك — $100</a>
            </div>
          </div>
        </section>
      )}

      {/* FILTER */}
      <section className="filter-row" style={{ padding: "0 48px 28px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2, direction: "rtl", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} className="filter-btn" onClick={() => setFilter(c)} style={{
            fontSize: 12, fontWeight: 700, padding: "7px 18px", borderRadius: 99,
            background: filter === c ? "#1a4fc4" : "rgba(255,255,255,.05)",
            color: filter === c ? "#fff" : "rgba(240,244,255,.5)", transition: "all .2s",
          }}>{c}</button>
        ))}
      </section>

      {/* POSTS GRID */}
      <section className="posts-grid" style={{ padding: "0 48px 100px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2, direction: "rtl", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {filtered.map((post, i) => <PostCard key={post.id} post={post} idx={i} subscribed={subscribed} />)}
      </section>

      <footer className="blog-footer" style={{ background: "#000510", borderTop: "1px solid rgba(255,255,255,.05)", padding: "32px 48px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.2)" }}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
