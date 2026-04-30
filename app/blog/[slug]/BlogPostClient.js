use client";
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
  .prose ul li::before{content:"â";position:absolute;right:0;color:#ff2d7a;font-size:8px;top:8px}
  .prose strong{color:#f0f4ff;font-weight:700}
  .prose blockquote{border-right:3px solid #ff2d7a;padding:16px 24px;background:rgba(255,45,122,.06);border-radius:0 8px 8px 0;margin:24px 0}
  .prose blockquote p{color:rgba(240,244,255,.7);font-style:italic;margin:0}
`;

const POSTS = {
  "inventory-waste": {
    title: "ÙÙÙ ØªÙÙÙ ÙØ¯Ø± ÙØ·Ø¹ÙÙ Ø¨ÙØ³Ø¨Ø© 30% Ø®ÙØ§Ù Ø´ÙØ± ÙØ§Ø­Ø¯",
    category: "Ø§ÙÙØ®Ø²ÙÙ", categoryColor: "#ffd60a",
    date: "15 Ø£Ø¨Ø±ÙÙ 2026", readTime: "6 Ø¯ÙØ§Ø¦Ù", icon: "ð¦",
    content: `
      <h2>ÙÙØ§Ø°Ø§ Ø§ÙÙØ¯Ø± ÙØ¯ÙØ± Ø£Ø±Ø¨Ø§Ø­ÙØ</h2>
      <p>ÙÙ ÙØªÙØ³Ø· Ø§ÙÙØ·Ø§Ø¹Ù Ø§ÙØ¹Ø±Ø§ÙÙØ©Ø ÙØµÙ Ø§ÙÙØ¯Ø± Ø§ÙØºØ°Ø§Ø¦Ù Ø¥ÙÙ <strong>25-35% ÙÙ Ø¥Ø¬ÙØ§ÙÙ ØªÙØ§ÙÙÙ Ø§ÙÙÙØ§Ø¯ Ø§ÙØ®Ø§Ù</strong>. ÙØ°Ø§ ÙØ¹ÙÙ Ø£Ù ÙÙ 100,000 Ø¯ÙÙØ§Ø± ØªØµØ±ÙÙØ§ Ø¹ÙÙ Ø§ÙÙÙØ§Ø¯Ø 30,000 Ø¯ÙÙØ§Ø± ØªØ°ÙØ¨ ÙØ¨Ø§Ø¡Ù.</p>
      <blockquote><p>Ø§ÙÙØ¯Ø± ÙÙØ³ ÙØ¯Ø±Ø§Ù â ÙÙ ÙØªÙØ¬Ø© ØºÙØ§Ø¨ Ø§ÙÙØ¸Ø§Ù. ÙÙÙ ÙØ·Ø¹Ù ÙØ³ØªØ·ÙØ¹ ØªÙÙÙÙÙ Ø¥Ø°Ø§ Ø·Ø¨ÙÙ Ø§ÙØ£Ø¯ÙØ§Øª Ø§ÙØµØ­.</p></blockquote>
      <h2>Ø§ÙØ£Ø³Ø¨Ø§Ø¨ Ø§ÙØ­ÙÙÙÙØ© ÙÙÙØ¯Ø±</h2>
      <ul>
        <li>ØºÙØ§Ø¨ ÙØ¸Ø§Ù ØªØªØ¨Ø¹ Ø§ÙÙØ®Ø²ÙÙ â ÙØ§ Ø£Ø­Ø¯ ÙØ¹Ø±Ù ÙØ§Ø°Ø§ ÙÙØ¬Ø¯ Ø¨Ø§ÙØ¶Ø¨Ø·</li>
        <li>Ø§ÙØ·ÙØ¨ÙØ§Øª Ø§ÙØ¹Ø´ÙØ§Ø¦ÙØ© â ÙØ·ÙØ¨ Ø£ÙØ«Ø± ÙÙØ§ ÙØ­ØªØ§Ø¬ ÙØ£ÙÙØ§ ÙØ§ ÙØ¹Ø±Ù ÙØ§ Ø¹ÙØ¯ÙØ§</li>
        <li>Ø³ÙØ¡ Ø§ÙØªØ®Ø²ÙÙ â ÙÙØ§Ø¯ ØªÙØ³Ø¯ ÙØ£ÙÙØ§ ÙØ§ ØªÙØ®Ø²ÙÙÙ Ø¨Ø´ÙÙ ØµØ­ÙØ­</li>
        <li>Ø¹Ø¯Ù Ø­Ø³Ø§Ø¨ Ø§Ø³ØªÙÙØ§Ù Ø§ÙØ£ØµÙØ§Ù â ÙØ§ ÙØ¹Ø±Ù ÙÙ ÙØ³ØªÙÙÙ ÙÙ Ø·Ø¨Ù ÙÙ ÙÙ ÙØ§Ø¯Ø©</li>
      </ul>
      <h2>Ø§ÙØ­Ù Ø®Ø·ÙØ© Ø¨Ø®Ø·ÙØ©</h2>
      <h3>Ø§ÙØ®Ø·ÙØ© 1: Ø¬Ø±Ø¯ Ø´Ø§ÙÙ</h3>
      <p>Ø§Ø¨Ø¯Ø£ Ø¨Ø¬Ø±Ø¯ ÙØ¯ÙÙ ÙØ§ÙÙ ÙÙÙ ÙØ§ ÙÙ ÙØ·Ø¨Ø®Ù â ÙÙ ÙØ§Ø¯Ø© Ø®Ø§ÙØ ÙÙÙØ§ØªÙØ§Ø ÙØªØ§Ø±ÙØ® Ø§ÙØªÙØ§Ø¡ ØµÙØ§Ø­ÙØªÙØ§.</p>
      <h3>Ø§ÙØ®Ø·ÙØ© 2: Ø§Ø­Ø³Ø¨ Ø§Ø³ØªÙÙØ§Ù ÙÙ Ø·Ø¨Ù</h3>
      <p>ÙÙÙ ØµÙÙ ÙÙ ÙØ§Ø¦ÙØªÙØ Ø­Ø¯Ø¯ Ø¨Ø§ÙØ¶Ø¨Ø· ÙÙ ÙØ³ØªÙÙÙ ÙÙ ÙÙ ÙØ§Ø¯Ø© Ø®Ø§Ù. ÙØ°Ø§ ÙØ³ÙÙ Recipe Costing.</p>
      <h3>Ø§ÙØ®Ø·ÙØ© 3: Ø§Ø±Ø¨Ø· Ø§ÙÙØ®Ø²ÙÙ Ø¨Ø§ÙØ·ÙØ¨Ø§Øª</h3>
      <p>ÙÙ ÙØ§ ÙÙØ¨Ø§Ø¹ ÙØ¬Ø¨ Ø£Ù ÙÙØ®ØµÙ ØªÙÙØ§Ø¦ÙØ§Ù ÙÙ Ø§ÙÙØ®Ø²ÙÙ. ÙÙØ°Ø§ ØªØ¹Ø±Ù ÙÙ Ø£Ù ÙÙØª ÙÙ ØªØ¨ÙÙ ÙÙ ÙÙ ÙØ§Ø¯Ø©.</p>
      <h3>Ø§ÙØ®Ø·ÙØ© 4: Ø¶Ø¹ Ø­Ø¯ÙØ¯Ø§Ù Ø¯ÙÙØ§ ÙØªÙØ¨ÙÙØ§Øª</h3>
      <p>Ø­Ø¯Ø¯ ÙÙÙ ÙØ§Ø¯Ø© ÙØ³ØªÙÙ Ø£Ø¯ÙÙ â Ø¹ÙØ¯ÙØ§ ÙØµÙ Ø§ÙÙØ®Ø²ÙÙ ÙÙØ°Ø§ Ø§ÙÙØ³ØªÙÙ ÙØµÙÙ ØªÙØ¨ÙÙ ÙÙØ±Ù.</p>
      <h2>Ø§ÙÙØªØ§Ø¦Ø¬ Ø§ÙÙØªÙÙØ¹Ø©</h2>
      <ul>
        <li>ØªÙÙÙÙ Ø§ÙÙØ¯Ø± Ø¨ÙØ³Ø¨Ø© 25-35% Ø®ÙØ§Ù Ø£ÙÙ Ø´ÙØ±</li>
        <li>ØªÙÙÙØ± 15-20% ÙÙ ØªÙØ§ÙÙÙ Ø§ÙÙÙØ§Ø¯ Ø§ÙØ®Ø§Ù</li>
        <li>Ø§ÙÙØ¶Ø§Ø¡ Ø¹ÙÙ ÙÙØ§Ø¯ Ø§ÙØ£ØµÙØ§Ù Ø§ÙÙÙØ§Ø¬Ø¦</li>
      </ul>
      <blockquote><p>ÙØ·Ø¹Ù Ø·Ø¨ÙÙ ÙØ°Ø§ Ø§ÙÙØ¸Ø§Ù ÙØ¹ÙØ§ ÙÙ Ø¨ØºØ¯Ø§Ø¯ ÙÙÙØ± Ø£ÙØ«Ø± ÙÙ 2,500,000 Ø¯ÙÙØ§Ø± Ø´ÙØ±ÙØ§Ù ÙÙ Ø§ÙÙØ¯Ø± ÙØ­Ø¯Ù.</p></blockquote>
    `
  },
  "peak-hours": {
    title: "Ø³Ø§Ø¹Ø§Øª Ø§ÙØ°Ø±ÙØ©: ÙÙÙ ØªØ³ØªØ¹Ø¯ ÙØªØ¶Ø§Ø¹Ù Ø¥ÙØ±Ø§Ø¯Ø§ØªÙ",
    category: "Ø§ÙØªØ­ÙÙÙØ§Øª", categoryColor: "#00c3ff",
    date: "8 Ø£Ø¨Ø±ÙÙ 2026", readTime: "5 Ø¯ÙØ§Ø¦Ù", icon: "ð",
    content: `
      <h2>ÙØ§ ÙÙ Ø³Ø§Ø¹Ø§Øª Ø§ÙØ°Ø±ÙØ©Ø</h2>
      <p>Ø³Ø§Ø¹Ø§Øª Ø§ÙØ°Ø±ÙØ© ÙÙ Ø§ÙÙØªØ±Ø§Øª Ø§ÙØªÙ ÙØ±ØªÙØ¹ ÙÙÙØ§ Ø§ÙØ·ÙØ¨ Ø¨Ø´ÙÙ ÙØ¨ÙØ± â Ø¹Ø§Ø¯Ø©Ù Ø§ÙØºØ¯Ø§Ø¡ (12-2) ÙØ§ÙØ¹Ø´Ø§Ø¡ (7-9). ÙØ¹Ø¸Ù Ø§ÙÙØ·Ø§Ø¹Ù ØªØ®Ø³Ø± ÙÙ ÙØ°Ù Ø§ÙØ£ÙÙØ§Øª ÙØ£ÙÙØ§ ØºÙØ± ÙØ³ØªØ¹Ø¯Ø©.</p>
      <h2>ÙÙÙ ØªØ¹Ø±Ù Ø°Ø±ÙØªÙØ</h2>
      <ul>
        <li>Ø­ÙÙÙ Ø¨ÙØ§ÙØ§Øª ÙØ¨ÙØ¹Ø§ØªÙ Ø§ÙÙÙÙÙØ© Ø¹ÙÙ ÙØ¯Ù Ø´ÙØ±</li>
        <li>Ø­Ø¯Ø¯ Ø§ÙØ³Ø§Ø¹Ø§Øª Ø§ÙØ£Ø¹ÙÙ Ø·ÙØ¨Ø§Ù</li>
        <li>ÙØ§Ø±Ù Ø¨ÙÙ Ø£ÙØ§Ù Ø§ÙØ£Ø³Ø¨ÙØ¹ â Ø§ÙØ¬ÙØ¹Ø© ÙØ§ÙØ³Ø¨Øª Ø¹Ø§Ø¯Ø©Ù Ø£Ø¹ÙÙ</li>
      </ul>
      <h2>Ø§ÙØ§Ø³ØªØ¹Ø¯Ø§Ø¯ Ø§ÙØµØ­</h2>
      <p>ÙØ¨Ù Ø³Ø§Ø¹Ø© ÙÙ Ø§ÙØ°Ø±ÙØ©: Ø¬ÙÙØ²ÙØ© Ø§ÙÙØ·Ø¨Ø® Ø§ÙÙØ§ÙÙØ©Ø ØªÙÙØ± Ø¬ÙÙØ¹ Ø§ÙÙÙØ§Ø¯ Ø§ÙØ®Ø§ÙØ Ø­Ø¶ÙØ± ÙÙ Ø§ÙØ·Ø§ÙÙ Ø§ÙÙØ·ÙÙØ¨.</p>
      <blockquote><p>Ø§ÙØ°Ø±ÙØ© ÙØ±ØµØ© Ø°ÙØ¨ÙØ© â ÙÙ ÙØ³ØªØ¹Ø¯ Ø¬ÙØ¯Ø§Ù ÙØ¶Ø§Ø¹Ù Ø¥ÙØ±Ø§Ø¯Ø§ØªÙØ ÙÙÙ ÙØ§ ÙØ³ØªØ¹Ø¯ ÙØ®Ø³Ø± Ø²Ø¨Ø§Ø¦ÙÙ ÙÙÙÙØ§ÙØ³.</p></blockquote>
    `
  },
  "staff-management": {
    title: "Ø¥Ø¯Ø§Ø±Ø© ÙÙØ¸ÙÙ Ø§ÙÙØ·Ø¹Ù: ÙÙ Ø§ÙÙÙØ¶Ù Ø¥ÙÙ Ø§ÙÙØ¸Ø§Ù ÙÙ 4 Ø®Ø·ÙØ§Øª",
    category: "Ø§ÙÙÙØ¸ÙÙÙ", categoryColor: "#00ff88",
    date: "1 Ø£Ø¨Ø±ÙÙ 2026", readTime: "8 Ø¯ÙØ§Ø¦Ù", icon: "ð¥",
    content: `
      <h2>Ø§ÙÙØ´ÙÙØ© Ø§ÙØ­ÙÙÙÙØ©</h2>
      <p>ÙØ±ÙÙ ØºÙØ± ÙÙØ¸Ù ÙÙÙÙÙ Ø£ÙØ«Ø± ÙÙ ÙØ±ÙÙ ØµØºÙØ± ÙÙØ¶Ø¨Ø·. ØºÙØ§Ø¨ Ø§ÙØ¬Ø¯Ø§ÙÙ Ø§ÙÙØ§Ø¶Ø­Ø© ÙØ§ÙØ£Ø¯ÙØ§Ø± Ø§ÙÙØ­Ø¯Ø¯Ø© ÙØ³Ø¨Ø¨ Ø§ÙÙÙØ¶Ù ÙÙÙÙØ§Ù.</p>
      <h2>Ø§ÙØ®Ø·ÙØ§Øª Ø§ÙØ£Ø±Ø¨Ø¹</h2>
      <h3>1. Ø­Ø¯Ø¯ Ø§ÙØ£Ø¯ÙØ§Ø± Ø¨ÙØ¶ÙØ­</h3>
      <p>ÙÙ ÙÙØ¸Ù ÙØ¬Ø¨ Ø£Ù ÙØ¹Ø±Ù ÙÙØ§ÙÙ Ø¨Ø§ÙØ¶Ø¨Ø· â ÙØ§ ØªØ¯Ø§Ø®Ù ÙÙØ§ Ø«ØºØ±Ø§Øª.</p>
      <h3>2. Ø¬Ø¯Ø§ÙÙ ÙØ±Ø¯ÙØ§Øª Ø°ÙÙØ©</h3>
      <p>Ø¨ÙØ§Ø¡ Ø¬Ø¯Ø§ÙÙ ÙØ¨ÙÙØ© Ø¹ÙÙ Ø³Ø§Ø¹Ø§Øª Ø§ÙØ°Ø±ÙØ© Ø§ÙÙØ¹ÙÙØ© ÙÙØ·Ø¹ÙÙ.</p>
      <h3>3. ÙØ¸Ø§Ù ØªÙÙÙÙ Ø§ÙØ£Ø¯Ø§Ø¡</h3>
      <p>ÙÙØ§Ø³ Ø£Ø¯Ø§Ø¡ ÙÙ ÙÙØ¸Ù Ø¨Ø£Ø±ÙØ§Ù ÙØ§Ø¶Ø­Ø© â Ø¹Ø¯Ø¯ Ø§ÙØ·ÙØ¨Ø§ØªØ Ø³Ø±Ø¹Ø© Ø§ÙØªÙÙÙØ°Ø Ø±Ø¶Ø§ Ø§ÙØ¹ÙÙØ§Ø¡.</p>
      <h3>4. Ø§ÙØªØ¯Ø±ÙØ¨ Ø§ÙÙØ³ØªÙØ±</h3>
      <p>ØªØ¯Ø±ÙØ¨ Ø£Ø³Ø¨ÙØ¹Ù ÙØµÙØ± ÙØ­Ø³Ù Ø§ÙØ£Ø¯Ø§Ø¡ Ø¨Ø´ÙÙ ÙÙØ­ÙØ¸ Ø®ÙØ§Ù Ø´ÙØ±.</p>
      <blockquote><p>ÙØ±ÙÙ ÙØ¯Ø±Ø¨ ÙÙÙØ¸Ù = ØªØ¬Ø±Ø¨Ø© Ø¹ÙÙØ§Ø¡ Ø£ÙØ¶Ù = Ø¥ÙØ±Ø§Ø¯Ø§Øª Ø£Ø¹ÙÙ.</p></blockquote>
    `
  },
  "menu-engineering": {
    title: "ÙÙØ¯Ø³Ø© ÙØ§Ø¦ÙØ© Ø§ÙØ·Ø¹Ø§Ù: Ø£Ù Ø£ØµÙØ§Ù ØªØ¬ÙØ¨ Ø§ÙØ±Ø¨Ø­Ø",
    category: "Ø§ÙØ±Ø¨Ø­ÙØ©", categoryColor: "#ff2d7a",
    date: "24 ÙØ§Ø±Ø³ 2026", readTime: "7 Ø¯ÙØ§Ø¦Ù", icon: "ð½ï¸",
    content: `
      <h2>ÙÙØ³ ÙÙ ØµÙÙ ÙØ³ØªØ­Ù ÙÙØ§ÙÙ</h2>
      <p>ÙÙØ¯Ø³Ø© Ø§ÙÙØ§Ø¦ÙØ© Ø¹ÙÙ ÙØ³Ø§Ø¹Ø¯Ù Ø¹ÙÙ ØªØ­Ø¯ÙØ¯ Ø£Ù Ø§ÙØ£ØµÙØ§Ù ØªØ¬ÙØ¨ Ø£ÙØ¨Ø± Ø±Ø¨Ø­ ÙØ£ÙÙØ§ ÙØ³ØªÙØ²Ù ÙÙØ§Ø±Ø¯Ù.</p>
      <h2>ØªØµÙÙÙ Ø§ÙØ£ØµÙØ§Ù</h2>
      <ul>
        <li><strong>Ø§ÙÙØ¬ÙÙ:</strong> ÙØ¨ÙØ¹Ø§Øª Ø¹Ø§ÙÙØ© + Ø±Ø¨Ø­ Ø¹Ø§ÙÙ â Ø§Ø­ØªÙØ¸ Ø¨ÙØ§ ÙØ±ÙÙØ¬ ÙÙØ§</li>
        <li><strong>Ø§ÙØ£Ø¨ÙØ§Ø±:</strong> ÙØ¨ÙØ¹Ø§Øª Ø¹Ø§ÙÙØ© + Ø±Ø¨Ø­ ÙÙØ®ÙØ¶ â Ø­Ø³ÙÙ ØªÙÙÙØªÙØ§</li>
        <li><strong>Ø§ÙØ£ÙØºØ§Ø²:</strong> ÙØ¨ÙØ¹Ø§Øª ÙÙØ®ÙØ¶Ø© + Ø±Ø¨Ø­ Ø¹Ø§ÙÙ â Ø±ÙÙØ¬ ÙÙØ§ Ø£ÙØ«Ø±</li>
        <li><strong>Ø§ÙÙÙØ§Ø¨:</strong> ÙØ¨ÙØ¹Ø§Øª ÙÙØ®ÙØ¶Ø© + Ø±Ø¨Ø­ ÙÙØ®ÙØ¶ â Ø§Ø­Ø°ÙÙØ§</li>
      </ul>
      <blockquote><p>Ø­Ø°Ù 3-5 Ø£ØµÙØ§Ù ØºÙØ± ÙØ±Ø¨Ø­Ø© ÙÙÙÙ Ø£Ù ÙØ±ÙØ¹ Ø£Ø±Ø¨Ø§Ø­Ù Ø§ÙØ¥Ø¬ÙØ§ÙÙØ© Ø¨ÙØ³Ø¨Ø© 15%.</p></blockquote>
    `
  },
  "order-routing": {
    title: "ØªÙØ¬ÙÙ Ø§ÙØ·ÙØ¨Ø§Øª Ø§ÙØ°ÙÙ: ÙÙÙ ØªÙÙÙ ÙÙØ¶Ù Ø§ÙÙØ·Ø¨Ø®",
    category: "Ø§ÙØ¹ÙÙÙØ§Øª", categoryColor: "#00c3ff",
    date: "15 ÙØ§Ø±Ø³ 2026", readTime: "5 Ø¯ÙØ§Ø¦Ù", icon: "â¡",
    content: `
      <h2>Ø§ÙÙÙØ¶Ù ÙÙ Ø§ÙÙØ·Ø¨Ø® ÙÙØ³Øª ÙØ¯Ø±Ø§Ù</h2>
      <p>ÙØ¸Ø§Ù ØªÙØ¬ÙÙ Ø§ÙØ·ÙØ¨Ø§Øª Ø§ÙØµØ­ÙØ­ ÙÙÙÙ Ø£Ù ÙÙÙÙ ÙÙØª Ø§ÙØªØ­Ø¶ÙØ± Ø¨ÙØ³Ø¨Ø© 40% ÙÙØ²ÙØ¯ Ø±Ø¶Ø§ Ø§ÙØ¹ÙÙØ§Ø¡ Ø¨Ø´ÙÙ ÙÙØ­ÙØ¸.</p>
      <h2>Ø¹ÙØ§ØµØ± Ø§ÙÙØ¸Ø§Ù Ø§ÙØ°ÙÙ</h2>
      <ul>
        <li>ØªÙØ²ÙØ¹ ØªÙÙØ§Ø¦Ù ÙÙØ·ÙØ¨Ø§Øª Ø¹ÙÙ Ø§ÙÙØ­Ø·Ø§Øª Ø­Ø³Ø¨ Ø§ÙØ­ÙÙ</li>
        <li>Ø£ÙÙÙÙØ§Øª ÙØ§Ø¶Ø­Ø© â Ø·ÙØ¨Ø§Øª Ø§ÙØ·Ø§ÙÙØ§Øª Ø§ÙØ£Ø·ÙÙ Ø§ÙØªØ¸Ø§Ø±Ø§Ù Ø£ÙÙØ§Ù</li>
        <li>ØªÙØ¨ÙÙØ§Øª ÙÙØ±ÙØ© Ø¹ÙØ¯ ØªØ¬Ø§ÙØ² ÙÙØª Ø§ÙØªØ­Ø¶ÙØ± Ø§ÙÙØ­Ø¯Ø¯</li>
        <li>ØªØªØ¨Ø¹ Ø²ÙÙ ÙÙ Ø·ÙØ¨ ÙÙ Ø§ÙØ§Ø³ØªÙØ§Ù ÙÙØªØ³ÙÙÙ</li>
      </ul>
      <blockquote><p>ÙØ·Ø¹Ù ÙÙØ¸Ù ÙØ®Ø¯Ù 40% Ø²Ø¨Ø§Ø¦Ù Ø£ÙØ«Ø± Ø¨ÙÙØ³ Ø§ÙÙØ±ÙÙ.</p></blockquote>
    `
  },
  "iraq-restaurant-market": {
    title: "Ø³ÙÙ Ø§ÙÙØ·Ø§Ø¹Ù ÙÙ Ø§ÙØ¹Ø±Ø§Ù 2026: Ø§ÙÙØ±Øµ ÙØ§ÙØªØ­Ø¯ÙØ§Øª",
    category: "Ø§ÙØ³ÙÙ Ø§ÙØ¹Ø±Ø§ÙÙ", categoryColor: "#ffd60a",
    date: "5 ÙØ§Ø±Ø³ 2026", readTime: "10 Ø¯ÙØ§Ø¦Ù", icon: "ð®ð¶",
    content: `
      <h2>ÙØ§ÙØ¹ Ø§ÙØ³ÙÙ Ø§ÙØ¹Ø±Ø§ÙÙ</h2>
      <p>ÙØ·Ø§Ø¹ Ø§ÙÙØ·Ø§Ø¹Ù ÙÙ Ø§ÙØ¹Ø±Ø§Ù ÙØ´ÙØ¯ ÙÙÙØ§Ù ÙÙØ­ÙØ¸Ø§Ù â ÙÙÙ ÙØ¹Ø¸Ù Ø§ÙÙØ·Ø§Ø¹Ù ØªÙØªÙØ± ÙÙØ£ÙØ¸ÙØ© Ø§ÙØ§Ø­ØªØ±Ø§ÙÙØ© Ø§ÙØªÙ ØªØ­ÙÙ ÙØ°Ø§ Ø§ÙÙÙÙ Ø¥ÙÙ Ø£Ø±Ø¨Ø§Ø­ Ø­ÙÙÙÙØ©.</p>
      <h2>Ø§ÙÙØ±Øµ</h2>
      <ul>
        <li>Ø·Ø¨ÙØ© ÙØ³Ø·Ù ÙØªÙØ§ÙÙØ© ÙØ¥ÙÙØ§Ù ÙØªØ²Ø§ÙØ¯ Ø¹ÙÙ Ø§ÙØ·Ø¹Ø§Ù Ø®Ø§Ø±Ø¬ Ø§ÙÙÙØ²Ù</li>
        <li>Ø§ÙØªØ´Ø§Ø± Ø§ÙØªÙØµÙÙ ÙØ§ÙØ·ÙØ¨ Ø§ÙØ¥ÙÙØªØ±ÙÙÙ</li>
        <li>ØºÙØ§Ø¨ Ø§ÙÙÙØ§ÙØ³Ø© Ø§ÙØ§Ø­ØªØ±Ø§ÙÙØ© ÙÙ ÙØ¹Ø¸Ù Ø§ÙÙØ¯Ù</li>
        <li>Ø¥ÙÙØ§ÙÙØ© Ø§ÙØªÙØ³Ø¹ Ø§ÙØ³Ø±ÙØ¹ Ø¨ØªÙØ§ÙÙÙ ÙÙØ®ÙØ¶Ø© ÙØ³Ø¨ÙØ§Ù</li>
      </ul>
      <h2>Ø§ÙØªØ­Ø¯ÙØ§Øª</h2>
      <ul>
        <li>ØºÙØ§Ø¨ Ø§ÙÙÙØ§Ø¯Ø± Ø§ÙÙØ¯Ø±Ø¨Ø© Ø¹ÙÙ Ø¥Ø¯Ø§Ø±Ø© Ø§ÙÙØ·Ø§Ø¹Ù</li>
        <li>Ø§Ø±ØªÙØ§Ø¹ ØªÙØ§ÙÙÙ Ø§ÙÙÙØ§Ø¯ Ø§ÙØ®Ø§Ù ÙØ¹Ø¯Ù Ø§Ø³ØªÙØ±Ø§Ø±ÙØ§</li>
        <li>ÙÙØ§ÙØ³Ø© ØºÙØ± ÙÙØ¸ÙØ© ØªØ¶ØºØ· Ø¹ÙÙ Ø§ÙØ£Ø³Ø¹Ø§Ø±</li>
      </ul>
      <blockquote><p>Ø§ÙÙØ·Ø¹Ù Ø§ÙØ°Ù ÙÙØªÙÙ ÙØ¸Ø§ÙØ§Ù Ø§Ø­ØªØ±Ø§ÙÙØ§Ù Ø§ÙÙÙÙ Ø³ÙÙÙÙ Ø±Ø§Ø¦Ø¯Ø§Ù ÙÙ Ø³ÙÙÙ ØºØ¯Ø§Ù.</p></blockquote>
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
        <a href="/blog" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, color: "rgba(240,244,255,.5)", textDecoration: "none" }}>â Ø§ÙÙØ¯ÙÙØ©</a>
        <a href="https://wa.me/9647734383437" target="_blank" style={{ fontFamily: "Cairo", fontSize: 13, fontWeight: 700, padding: "8px 20px", background: "#ff2d7a", color: "#fff", borderRadius: 4, textDecoration: "none" }}>ØªÙØ§ØµÙ ð¬</a>
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
            <a href="/blog" style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.3)", textDecoration: "none" }}>Ø§ÙÙØ¯ÙÙØ©</a>
            <span style={{ color: "rgba(240,244,255,.2)" }}>âº</span>
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
          <h3 style={{ fontFamily: "Cairo", fontSize: 22, fontWeight: 900, color: "#f0f4ff", marginBottom: 12 }}>ØªØ¨Ù ØªØ·Ø¨Ù ÙØ°Ø§ ÙÙ ÙØ·Ø¹ÙÙØ</h3>
          <p style={{ fontFamily: "Cairo", fontSize: 14, color: "rgba(240,244,255,.45)", marginBottom: 24, lineHeight: 1.8 }}>ÙØ­Ø§Ø¯Ø«Ø© ÙØ¬Ø§ÙÙØ© ÙØ¹ ÙØ±ÙÙ IQR â ÙØ­ÙÙ ÙØ¶Ø¹Ù ÙÙØ­Ø¯Ø¯ ÙÙ Ø£ÙÙ ØªØ¨Ø¯Ø£</p>
          <a href="https://wa.me/9647734383437" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "Cairo", fontSize: 14, fontWeight: 700, padding: "14px 36px", background: "#ff2d7a", color: "#fff", borderRadius: 8, textDecoration: "none", boxShadow: "0 0 30px rgba(255,45,122,.3)" }}>ð² ØªÙØ§ØµÙ Ø¹ÙÙ ÙØ§ØªØ³Ø§Ø¨</a>
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a href="/blog" style={{ fontFamily: "Cairo", fontSize: 13, color: "rgba(240,244,255,.3)", textDecoration: "none" }}>â Ø§ÙØ¹ÙØ¯Ø© ÙÙÙØ¯ÙÙØ©</a>
        </div>
      </article>
      <footer style={{ background: "#000510", borderTop: "1px solid rgba(255,255,255,.05)", padding: "40px 48px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ fontFamily: "Cairo", fontSize: 12, color: "rgba(240,244,255,.2)" }}>Â© 2026 IQR ÙØ¥Ø¯Ø§Ø±Ø© ÙØªØ·ÙÙØ± Ø§ÙÙØ·Ø§Ø¹Ù â Ø§ÙØ¹Ø±Ø§Ù</p>
      </footer>
    </>
  );
}
