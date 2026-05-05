"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { POSTS_CONTENT, POSTS_LIST, FREE_SLUGS } from "../../../lib/posts";
import { BlogGate } from "../../../subscription/SubscriptionGate";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#1a4fc4;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

  .prose h2{font-family:'Cairo';font-size:clamp(20px,3vw,26px);font-weight:900;color:#f0f4ff;margin:48px 0 16px;padding-right:16px;border-right:3px solid #1a4fc4;line-height:1.3}
  .prose h3{font-family:'Cairo';font-size:clamp(16px,2.5vw,19px);font-weight:700;color:rgba(240,244,255,.85);margin:32px 0 12px}
  .prose p{font-family:'Cairo';font-size:clamp(14px,2vw,16px);color:rgba(240,244,255,.6);line-height:2.1;margin-bottom:20px}
  .prose strong{color:#f0f4ff;font-weight:700}
  .prose ul,.prose ol{margin:0 0 20px 0;padding:0;list-style:none}
  .prose ul li{font-family:'Cairo';font-size:clamp(13px,1.8vw,15px);color:rgba(240,244,255,.58);line-height:1.9;margin-bottom:10px;padding-right:26px;position:relative}
  .prose ul li::before{content:'';position:absolute;right:0;top:9px;width:7px;height:7px;border-radius:50%;background:#1a4fc4;box-shadow:0 0 7px rgba(26,79,196,.6)}
  .prose ol{counter-reset:step}
  .prose ol li{font-family:'Cairo';font-size:clamp(13px,1.8vw,15px);color:rgba(240,244,255,.58);line-height:1.9;margin-bottom:12px;padding-right:40px;position:relative;counter-increment:step}
  .prose ol li::before{content:counter(step);position:absolute;right:0;top:2px;width:24px;height:24px;border-radius:6px;background:rgba(26,79,196,.15);border:1px solid rgba(26,79,196,.3);color:#1a4fc4;font-size:11px;font-weight:700;font-family:'Space Mono';display:flex;align-items:center;justify-content:center}
  .prose blockquote{border-right:3px solid #1a4fc4;padding:18px 24px;background:rgba(26,79,196,.06);border-radius:0 10px 10px 0;margin:28px 0}
  .prose blockquote p{color:rgba(240,244,255,.72);font-style:italic;margin:0;font-size:clamp(14px,2vw,17px);line-height:1.9}
  .prose .stat-box{background:linear-gradient(135deg,rgba(26,79,196,.08),rgba(0,195,255,.04));border:1px solid rgba(26,79,196,.2);border-radius:14px;padding:24px 28px;margin:28px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .prose .stat-item{text-align:center}
  .prose .stat-num{font-family:'Space Mono';font-size:clamp(24px,4vw,36px);font-weight:700;line-height:1;margin-bottom:6px}
  .prose .stat-label{font-family:'Cairo';font-size:11px;color:rgba(240,244,255,.4);font-weight:600}
  .prose .tip-box{background:rgba(0,255,136,.05);border:1px solid rgba(0,255,136,.2);border-radius:10px;padding:18px 22px;margin:20px 0;display:flex;gap:12px;align-items:flex-start}
  .prose .tip-icon{font-size:20px;flex-shrink:0;margin-top:2px}
  .prose .tip-text{font-family:'Cairo';font-size:clamp(12px,1.8vw,14px);color:rgba(240,244,255,.65);line-height:1.8}
  .prose .warn-box{background:rgba(255,214,10,.05);border:1px solid rgba(255,214,10,.2);border-radius:10px;padding:18px 22px;margin:20px 0;display:flex;gap:12px;align-items:flex-start}
  .prose table{width:100%;border-collapse:collapse;margin:24px 0;overflow-x:auto;display:block}
  .prose th{font-family:'Cairo';font-size:11px;font-weight:700;color:rgba(240,244,255,.4);letter-spacing:.08em;padding:11px 14px;border-bottom:1px solid rgba(255,255,255,.07);text-align:right;white-space:nowrap}
  .prose td{font-family:'Cairo';font-size:clamp(12px,1.8vw,14px);color:rgba(240,244,255,.6);padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.04);text-align:right}
  .prose tr:last-child td{border-bottom:none}
  .prose tr:hover td{background:rgba(26,79,196,.04)}

  /* RESPONSIVE */
  @media(max-width:768px){
    .post-nav{padding:14px 20px!important}
    .post-header{padding:90px 20px 40px!important}
    .post-header h1{font-size:clamp(22px,6vw,36px)!important}
    .post-body{padding:0 20px 48px!important}
    .post-cta{margin:0 20px 60px!important;padding:28px 24px!important}
    .post-related{padding:0 20px 60px!important}
    .related-grid{grid-template-columns:1fr!important}
    .prose .stat-box{grid-template-columns:1fr!important;gap:12px!important}
    .post-footer{padding:24px 20px!important}
    .post-meta{flex-wrap:wrap!important;gap:8px!important}
  }
`;

function Nav({ categoryColor }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 60);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <nav className="post-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(0,8,20,.97)" : "rgba(0,8,20,.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "all .4s", direction: "rtl" }}>
        <a href="/" style={{ fontFamily: "Space Mono", fontSize: 18, fontWeight: 700, color: "#f0f4ff", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, background: "#1a4fc4", borderRadius: "50%", animation: "blink 2s infinite" }} />IQR
        </a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/blog/" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: "rgba(240,244,255,.5)", textDecoration: "none" }}>← المدونة</a>
          <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 12, fontWeight: 700, padding: "7px 16px", background: "rgba(205,127,50,.12)", color: "#cd7f32", border: "1px solid rgba(205,127,50,.25)", borderRadius: 6, textDecoration: "none" }}>🔑 اشترك</a>
        </div>
      </nav>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 101 }}>
        <div style={{ height: "100%", background: `linear-gradient(to left,${categoryColor},#1a4fc4)`, width: `${progress}%`, transition: "width .1s", boxShadow: `0 0 8px ${categoryColor}` }} />
      </div>
    </>
  );
}

export default function BlogPostClient({ params: propParams }) {
  const routeParams = useParams();
  const rawSlug = propParams?.slug || routeParams?.slug || "call-center-setup";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const post = POSTS_CONTENT[slug];
  const isFree = FREE_SLUGS.includes(slug);

  if (!post) {
    return (
      <>
        <style>{G}</style>
        <div style={{ background: "#000814", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", direction: "rtl", padding: "48px" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📄</div>
          <h1 style={{ fontFamily: "Cairo", fontSize: 26, fontWeight: 900, color: "#f0f4ff", marginBottom: 12 }}>المقال قيد التحضير</h1>
          <a href="/blog/" style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "12px 28px", background: "#1a4fc4", color: "#fff", borderRadius: 8, textDecoration: "none" }}>العودة للمدونة</a>
        </div>
      </>
    );
  }

  const related = POSTS_LIST.filter(p => p.slug !== slug).slice(0, 3);
  const ArticleContent = () => <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />;

  return (
    <>
      <style>{G}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(26,79,196,.07),transparent 70%)", top: 0, right: 0, filter: "blur(80px)", animation: "orb 15s ease-in-out infinite" }} />
      </div>
      <Nav categoryColor={post.categoryColor} />

      {/* HEADER */}
      <header className="post-header" style={{ paddingTop: 110, paddingBottom: 48, paddingLeft: 48, paddingRight: 48, maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2, direction: "rtl", animation: "fadeUp .8s ease both" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 28, flexWrap: "wrap" }}>
          <a href="/blog/" style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.3)", textDecoration: "none" }}>المدونة</a>
          <span style={{ color: "rgba(240,244,255,.15)" }}>›</span>
          <span style={{ fontFamily: "Cairo", fontSize: 12, color: post.categoryColor, fontWeight: 700 }}>{post.category}</span>
          {isFree && <span style={{ fontFamily: "Cairo", fontSize: 10, fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,.1)", border: "1px solid rgba(0,255,136,.2)", borderRadius: 99, padding: "2px 8px" }}>مجاني</span>}
        </div>
        <div style={{ fontSize: 48, marginBottom: 20 }}>{post.icon}</div>
        <h1 style={{ fontFamily: "Cairo", fontWeight: 900, color: "#f0f4ff", lineHeight: 1.2, marginBottom: 18 }}>{post.title}</h1>
        <p style={{ fontFamily: "Cairo", fontSize: 16, color: "rgba(240,244,255,.5)", lineHeight: 1.8, marginBottom: 28, maxWidth: 600 }}>{post.excerpt}</p>
        <div className="post-meta" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: `${post.categoryColor}15`, color: post.categoryColor, border: `1px solid ${post.categoryColor}30` }}>{post.category}</span>
          <span style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.3)" }}>{post.date}</span>
          <span style={{ fontFamily: "Space Mono", fontSize: 11, color: "rgba(240,244,255,.3)" }}>{post.readTime}</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ fontFamily: "Cairo", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,.04)", color: "rgba(240,244,255,.35)", border: "1px solid rgba(255,255,255,.07)" }}>#{tag}</span>
          ))}
        </div>
        <div style={{ height: 1, background: `linear-gradient(to left,transparent,${post.categoryColor}60,transparent)`, marginTop: 36 }} />
      </header>

      {/* BODY */}
      <main className="post-body" style={{ maxWidth: 820, margin: "0 auto", padding: "0 48px 56px", position: "relative", zIndex: 2, direction: "rtl" }}>
        {isFree ? <ArticleContent /> : <BlogGate><ArticleContent /></BlogGate>}
      </main>

      {/* CTA */}
      <div className="post-cta" style={{ maxWidth: 820, margin: "0 auto 72px", padding: "0 48px", position: "relative", zIndex: 2 }}>
        <div style={{ background: "linear-gradient(135deg,rgba(26,79,196,.1),rgba(0,195,255,.05))", border: "1px solid rgba(26,79,196,.25)", borderRadius: 16, padding: "40px", textAlign: "center", direction: "rtl" }}>
          <div style={{ fontSize: 32, marginBottom: 14 }}>🚀</div>
          <h3 style={{ fontFamily: "Cairo", fontSize: "clamp(18px,3vw,22px)", fontWeight: 900, color: "#f0f4ff", marginBottom: 10 }}>تبي تطبق هذا في مطعمك؟</h3>
          <p style={{ fontFamily: "Cairo", fontSize: 14, color: "rgba(240,244,255,.45)", marginBottom: 28, lineHeight: 1.8, maxWidth: 460, margin: "0 auto 28px" }}>محادثة مجانية مع فريق IQR — بدون التزام.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/9647734383431" target="_blank" style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "13px 28px", background: "#1a4fc4", color: "#fff", borderRadius: 8, textDecoration: "none" }}>📲 واتساب</a>
            <a href="/pricing/" style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "12px 24px", background: "rgba(205,127,50,.12)", color: "#cd7f32", border: "1px solid rgba(205,127,50,.25)", borderRadius: 8, textDecoration: "none" }}>🔑 الخطة البرونزية</a>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <section className="post-related" style={{ maxWidth: 820, margin: "0 auto 80px", padding: "0 48px", position: "relative", zIndex: 2, direction: "rtl" }}>
        <h2 style={{ fontFamily: "Cairo", fontSize: 22, fontWeight: 900, color: "#f0f4ff", marginBottom: 20 }}>استمر في القراءة</h2>
        <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {related.map(r => (
            <a key={r.slug} href={`/blog/${r.slug}/`} style={{ display: "block", background: "#0a1628", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: "20px", textDecoration: "none", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(26,79,196,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,.05)"; }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{r.icon}</div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${r.categoryColor}15`, color: r.categoryColor, border: `1px solid ${r.categoryColor}25` }}>{r.category}</span>
              <h3 style={{ fontFamily: "Cairo", fontSize: 14, fontWeight: 900, color: "#f0f4ff", margin: "10px 0 8px", lineHeight: 1.4 }}>{r.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#1a4fc4" }}>
                <span style={{ fontFamily: "Cairo", fontSize: 11, fontWeight: 700 }}>اقرأ ←</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="post-footer" style={{ background: "#000510", borderTop: "1px solid rgba(255,255,255,.05)", padding: "28px 48px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.2)" }}>© 2026 IQR لإدارة وتطوير المطاعم — العراق — جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
}
