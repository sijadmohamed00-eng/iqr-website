"use client";
import { useState, useEffect } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000814;overflow-x:hidden;font-family:'Cairo',sans-serif}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#ff2d7a;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
  .prose p{font-family:'Cairo',sans-serif;font-size:16px;color:rgba(240,244,255,.6);line-height:2;margin-bottom:20px}
  .prose h2{font-family:'Cairo',sans-serif;font-size:24px;font-weight:900;color:#f0f4ff;margin:40px 0 16px}
  .prose h3{font-family:'Cairo',sans-serif;font-size:18px;font-weight:700;color:rgba(240,244,255,.8);margin:28px 0 12px}
  .prose ul{padding-right:20px;margin-bottom:20px}
  .prose ul li{font-family:'Cairo',sans-serif;font-size:15px;color:rgba(240,244,255,.55);line-height:1.9;margin-bottom:8px;list-style:none;padding-right:20px;position:relative}
  .prose ul li::before{content:"◆";position:absolute;right:0;color:#ff2d7a;font-size:8px;top:8px}
  .prose strong{color:#f0f4ff;font-weight:700}
  .prose blockquote{border-right:3px solid #ff2d7a;padding:16px 24px;background:rgba(255,45,122,.06);border-radius:0 8px 8px 0;margin:24px 0}
  .prose blockquote p{color:rgba(240,244,255,.7);font-style:italic;margin:0}
`;

const POSTS = {
  "inventory-waste": {
    title: "كيف تقلل هدر مطعمك بنسبة 30% خلال شهر واحد",
    category: "المخزون", categoryColor: "#ffd60a",
    date: "15 أبريل 2026", readTime: "6 دقائق", icon: "📦",
    content: `
      <h2>لماذا الهدر يدمر أرباحك؟</h2>
      <p>في متوسط المطاعم العراقية، يصل الهدر الغذائي إلى <strong>25-35% من إجمالي تكاليف المواد الخام</strong>. هذا يعني أن كل 100,000 دينار تصرفها على المواد، 30,000 دينار تذهب هباءً.</p>
      <blockquote><p>الهدر ليس قدراً — هو نتيجة غياب النظام. وكل مطعم يستطيع تقليله إذا طبّق الأدوات الصح.</p></blockquote>
      <h2>الأسباب الحقيقية للهدر</h2>
      <ul>
        <li>غياب نظام تتبع المخزون — لا أحد يعرف ماذا يوجد بالضبط</li>
        <li>الطلبيات العشوائية — نطلب أكثر مما نحتاج لأننا لا نعرف ما عندنا</li>
        <li>سوء التخزين — مواد تفسد لأنها لا تُخزَّن بشكل صحيح</li>
        <li>عدم حساب استهلاك الأصناف — لا نعرف كم يستهلك كل طبق من كل مادة</li>
      </ul>
      <h2>الحل خطوة بخطوة</h2>
      <h3>الخطوة 1: جرد شامل</h3>
      <p>ابدأ بجرد يدوي كامل لكل ما في مطبخك — كل مادة خام، كمياتها، وتاريخ انتهاء صلاحيتها.</p>
      <h3>الخطوة 2: احسب استهلاك كل طبق</h3>
      <p>لكل صنف في قائمتك، حدد بالضبط كم يستهلك من كل مادة خام. هذا يسمى Recipe Costing.</p>
      <h3>الخطوة 3: اربط المخزون بالطلبات</h3>
      <p>كل ما يُباع يجب أن يُخصم تلقائياً من المخزون. هكذا تعرف في أي وقت كم تبقى من كل مادة.</p>
      <h3>الخطوة 4: ضع حدوداً دنيا وتنبيهات</h3>
      <p>حدد لكل مادة مستوى أدنى — عندما يصل المخزون لهذا المستوى يصلك تنبيه فوري.</p>
      <h2>النتائج المتوقعة</h2>
      <ul>
        <li>تقليل الهدر بنسبة 25-35% خلال أول شهر</li>
        <li>توفير 15-20% من تكاليف المواد الخام</li>
        <li>القضاء على نفاد الأصناف المفاجئ</li>
      </ul>
      <blockquote><p>مطعم طبّق هذا النظام معنا في بغداد وفّر أكثر من 2,500,000 دينار شهرياً من الهدر وحده.</p></blockquote>
    `
  },
  "peak-hours": {
    title: "ساعات الذروة: كيف تستعد وتضاعف إيراداتك",
    category: "التحليلات", categoryColor: "#00c3ff",
    date: "8 أبريل 2026", readTime: "5 دقائق", icon: "📊",
    content: `
      <h2>ما هي ساعات الذروة؟</h2>
      <p>ساعات الذروة هي الفترات التي يرتفع فيها الطلب بشكل كبير — عادةً الغداء (12-2) والعشاء (7-9). معظم المطاعم تخسر في هذه الأوقات لأنها غير مستعدة.</p>
      <h2>كيف تعرف ذروتك؟</h2>
      <ul>
        <li>حلّل بيانات مبيعاتك اليومية على مدى شهر</li>
        <li>حدد الساعات الأعلى طلباً</li>
        <li>قارن بين أيام الأسبوع — الجمعة والسبت عادةً أعلى</li>
      </ul>
      <h2>الاستعداد الصح</h2>
      <p>قبل ساعة من الذروة: جهوزية المطبخ الكاملة، توفر جميع المواد الخام، حضور كل الطاقم المطلوب.</p>
      <blockquote><p>الذروة فرصة ذهبية — من يستعد جيداً يضاعف إيراداته، ومن لا يستعد يخسر زبائنه للمنافس.</p></blockquote>
    `
  },
  "staff-management": {
    title: "إدارة موظفي المطعم: من الفوضى إلى النظام في 4 خطوات",
    category: "الموظفون", categoryColor: "#00ff88",
    date: "1 أبريل 2026", readTime: "8 دقائق", icon: "👥",
    content: `
      <h2>المشكلة الحقيقية</h2>
      <p>فريق غير منظم يكلفك أكثر من فريق صغير منضبط. غياب الجداول الواضحة والأدوار المحددة يسبب الفوضى يومياً.</p>
      <h2>الخطوات الأربع</h2>
      <h3>1. حدد الأدوار بوضوح</h3>
      <p>كل موظف يجب أن يعرف مهامه بالضبط — لا تداخل ولا ثغرات.</p>
      <h3>2. جداول ورديات ذكية</h3>
      <p>بناء جداول مبنية على ساعات الذروة الفعلية لمطعمك.</p>
      <h3>3. نظام تقييم الأداء</h3>
      <p>قياس أداء كل موظف بأرقام واضحة — عدد الطلبات، سرعة التنفيذ، رضا العملاء.</p>
      <h3>4. التدريب المستمر</h3>
      <p>تدريب أسبوعي قصير يحسن الأداء بشكل ملحوظ خلال شهر.</p>
      <blockquote><p>فريق مدرب ومنظم = تجربة عملاء أفضل = إيرادات أعلى.</p></blockquote>
    `
  },
  "menu-engineering": {
    title: "هندسة قائمة الطعام: أي أصناف تجلب الربح؟",
    category: "الربحية", categoryColor: "#ff2d7a",
    date: "24 مارس 2026", readTime: "7 دقائق", icon: "🍽️",
    content: `
      <h2>ليس كل صنف يستحق مكانه</h2>
      <p>هندسة القائمة علم يساعدك على تحديد أي الأصناف تجلب أكبر ربح وأيها يستنزف مواردك.</p>
      <h2>تصنيف الأصناف</h2>
      <ul>
        <li><strong>النجوم:</strong> مبيعات عالية + ربح عالي — احتفظ بها وروّج لها</li>
        <li><strong>الأبقار:</strong> مبيعات عالية + ربح منخفض — حسّن تكلفتها</li>
        <li><strong>الألغاز:</strong> مبيعات منخفضة + ربح عالي — روّج لها أكثر</li>
        <li><strong>الكلاب:</strong> مبيعات منخفضة + ربح منخفض — احذفها</li>
      </ul>
      <blockquote><p>حذف 3-5 أصناف غير مربحة يمكن أن يرفع أرباحك الإجمالية بنسبة 15%.</p></blockquote>
    `
  },
  "order-routing": {
    title: "توجيه الطلبات الذكي: كيف تنهي فوضى المطبخ",
    category: "العمليات", categoryColor: "#00c3ff",
    date: "15 مارس 2026", readTime: "5 دقائق", icon: "⚡",
    content: `
      <h2>الفوضى في المطبخ ليست قدراً</h2>
      <p>نظام توجيه الطلبات الصحيح يمكن أن يقلل وقت التحضير بنسبة 40% ويزيد رضا العملاء بشكل ملحوظ.</p>
      <h2>عناصر النظام الذكي</h2>
      <ul>
        <li>توزيع تلقائي للطلبات على المحطات حسب الحمل</li>
        <li>أولويات واضحة — طلبات الطاولات الأطول انتظاراً أولاً</li>
        <li>تنبيهات فورية عند تجاوز وقت التحضير المحدد</li>
        <li>تتبع زمن كل طلب من الاستلام للتسليم</li>
      </ul>
      <blockquote><p>مطعم منظم يخدم 40% زبائن أكثر بنفس الفريق.</p></blockquote>
    `
  },
  "iraq-restaurant-market": {
    title: "سوق المطاعم في العراق 2026: الفرص والتحديات",
    category: "السوق العراقي", categoryColor: "#ffd60a",
    date: "5 مارس 2026", readTime: "10 دقائق", icon: "🇮🇶",
    content: `
      <h2>واقع السوق العراقي</h2>
      <p>قطاع المطاعم في العراق يشهد نمواً ملحوظاً — لكن معظم المطاعم تفتقر للأنظمة الاحترافية التي تحول هذا النمو إلى أرباح حقيقية.</p>
      <h2>الفرص</h2>
      <ul>
        <li>طبقة وسطى متنامية وإنفاق متزايد على الطعام خارج المنزل</li>
        <li>انتشار التوصيل والطلب الإلكتروني</li>
        <li>غياب المنافسة الاحترافية في معظم المدن</li>
        <li>إمكانية التوسع السريع بتكاليف منخفضة نسبياً</li>
      </ul>
      <h2>التحديات</h2>
      <ul>
        <li>غياب الكوادر المدربة على إدارة المطاعم</li>
        <li>ارتفاع تكاليف المواد الخام وعدم استقرارها</li>
        <li>منافسة غير منظمة تضغط على الأسعار</li>
      </ul>
      <blockquote><p>المطعم الذي يمتلك نظاماً احترافياً اليوم سيكون رائداً في سوقه غداً.</p></blockquote>
    `
  },
};

export const SLUGS = Object.keys(POSTS);

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(0,8,20,.95)" : "rgba(0,8,20,.7)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "all .4s ease", direction: "rtl" }}>
      <a href="/" style={{ fontFamily: "Space Mono", fontSize: 20, fontWeight: 700, color: "#f0f4ff", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, background: "#ff2d7a", borderRadius: "50%", animation: "blink 2s infinite" }} />IQR
      </a>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <a href="/blog" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: "rgba(240,244,255,.5)", textDecoration: "none" }}>← المدونة</a>
        <a href="https://wa.me/9647734383437" target="_blank" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "8px 20px", background: "#ff2d7a", color: "#fff", borderRadius: 4, textDecoration: "none" }}>تواصل 💬</a>
      </div>
    </nav>
  );
}

export default function BlogPostClient({ params }) {
  const post = POSTS[params.slug] || POSTS["inventory-waste"];
  return (
    <>
      <style>{G}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,45,122,.06),transparent 70%)", top: 0, right: 0, filter: "blur(80px)", animation: "orb 15s ease-in-out infinite" }} />
      </div>
      <Nav />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "120px 48px 100px", position: "relative", zIndex: 2, direction: "rtl", animation: "fadeUp .8s ease both" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
            <a href="/blog" style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.3)", textDecoration: "none" }}>المدونة</a>
            <span style={{ color: "rgba(240,244,255,.2)" }}>›</span>
            <span style={{ fontFamily: "Cairo", fontSize: 12, color: post.categoryColor, fontWeight: 700 }}>{post.category}</span>
          </div>
          <div style={{ fontSize: 48, marginBottom: 20 }}>{post.icon}</div>
          <h1 style={{ fontFamily: "Cairo", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#f0f4ff", lineHeight: 1.15, marginBottom: 20 }}>{post.title}</h1>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.3)" }}>{post.date}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.2)" }} />
            <span style={{ fontFamily: "Space Mono", fontSize: 12, color: "rgba(240,244,255,.3)" }}>{post.readTime}</span>
          </div>
          <div style={{ height: 1, background: "linear-gradient(to left,transparent,#ff2d7a,transparent)", marginTop: 32 }} />
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div style={{ marginTop: 60, padding: "40px", background: "linear-gradient(135deg,rgba(255,45,122,.08),rgba(0,195,255,.04))", border: "1px solid rgba(255,45,122,.2)", borderRadius: 16, textAlign: "center" }}>
          <h3 style={{ fontFamily: "Cairo", fontSize: 22, fontWeight: 900, color: "#f0f4ff", marginBottom: 12 }}>تبي تطبق هذا في مطعمك؟</h3>
          <p style={{ fontFamily: "Cairo", fontSize: 14, color: "rgba(240,244,255,.45)", marginBottom: 24, lineHeight: 1.8 }}>محادثة مجانية مع فريق IQR — نحلل وضعك ونحدد من أين تبدأ</p>
          <a href="https://wa.me/9647734383437" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "14px 36px", background: "#ff2d7a", color: "#fff", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 30px rgba(255,45,122,.3)" }}>📲 تواصل على واتساب</a>
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a href="/blog" style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.3)", textDecoration: "none" }}>← العودة للمدونة</a>
        </div>
      </article>
      <footer style={{ background: "#000510", borderTop: "1px solid rgba(255,255,255,.05)", padding: "40px 48px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.2)" }}>© 2026 IQR لإدارة وتطوير المطاعم — العراق</p>
      </footer>
    </>
  );
}
