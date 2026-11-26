// Original product illustrations, drawn as inline SVG (no external images).
// window.ART.product(p) returns an <svg> for a product; window.ART.icon(kind, color) for any kind.
(() => {
  let uid = 0;
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v + amt * (amt > 0 ? 255 - v : v)))));
    return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
  };

  function svg(draw, color, opts = {}) {
    const u = ++uid;
    const id = k => `${k}${u}`;
    const c = color || "#e4572e";
    const defs = `
      <linearGradient id="${id("m")}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fbfcfd"/><stop offset=".45" stop-color="#b9c1ca"/><stop offset=".7" stop-color="#e9edf1"/><stop offset="1" stop-color="#8d96a1"/>
      </linearGradient>
      <linearGradient id="${id("md")}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6f7882"/><stop offset=".5" stop-color="#a9b1ba"/><stop offset="1" stop-color="#5d656e"/>
      </linearGradient>
      <linearGradient id="${id("h")}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${shade(c, -0.35)}"/><stop offset=".35" stop-color="${shade(c, 0.25)}"/><stop offset=".6" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.45)}"/>
      </linearGradient>
      <linearGradient id="${id("hv")}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${shade(c, 0.3)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.4)}"/>
      </linearGradient>
      <linearGradient id="${id("w")}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8a5a2b"/><stop offset=".4" stop-color="#c98d4f"/><stop offset=".7" stop-color="#b07338"/><stop offset="1" stop-color="#6e4520"/>
      </linearGradient>
      <linearGradient id="${id("k")}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4a4f57"/><stop offset="1" stop-color="#1e2126"/>
      </linearGradient>
      <radialGradient id="${id("s")}" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>`;
    const f = { m: `url(#${id("m")})`, md: `url(#${id("md")})`, h: `url(#${id("h")})`, hv: `url(#${id("hv")})`, w: `url(#${id("w")})`, k: `url(#${id("k")})`, c, dark: shade(c, -0.45), light: shade(c, 0.35), id };
    return `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" class="art">
      <defs>${defs}</defs>
      ${opts.noShadow ? "" : `<ellipse cx="120" cy="166" rx="${opts.shadow || 78}" ry="9" fill="url(#${id("s")})"/>`}
      ${draw(f)}
    </svg>`;
  }

  const D = {
    pliers: f => `
      <g transform="rotate(28 120 95)">
        <path d="M112 92 Q98 128 88 164 Q94 174 104 168 Q114 132 124 96 Z" fill="${f.h}"/>
        <path d="M128 92 Q142 128 152 164 Q146 174 136 168 Q126 132 116 96 Z" fill="${f.h}"/>
        <path d="M95 150 l16 4 M98 140 l15 4 M101 130 l14 4" stroke="${f.dark}" stroke-width="2" opacity=".5"/>
        <path d="M113 90 L106 30 Q111 14 118 26 L123 88 Z" fill="${f.m}" stroke="#7d8690" stroke-width="1"/>
        <path d="M127 90 L134 30 Q129 14 122 26 L117 88 Z" fill="${f.m}" stroke="#7d8690" stroke-width="1"/>
        <path d="M110 48 l9 1 M109 56 l10 1 M130 48 l-9 1 M131 56 l-10 1" stroke="#6b737c" stroke-width="1.5"/>
        <circle cx="120" cy="90" r="10" fill="${f.md}" stroke="#4d545c" stroke-width="1.5"/>
        <circle cx="120" cy="90" r="3.5" fill="#3a4047"/>
      </g>`,
    hammer: f => `
      <g transform="rotate(-28 120 100)">
        <rect x="111" y="62" width="18" height="108" rx="8" fill="${f.h}"/>
        <path d="M111 120 h18 M111 132 h18 M111 144 h18 M111 156 h18" stroke="${f.dark}" stroke-width="2" opacity=".45"/>
        <rect x="113" y="62" width="14" height="44" fill="${f.md}"/>
        <path d="M70 40 Q60 44 52 62 Q66 54 78 56 L112 58 L112 38 Z" fill="${f.m}" stroke="#6f7882"/>
        <rect x="104" y="32" width="54" height="34" rx="5" fill="${f.m}" stroke="#6f7882"/>
        <rect x="156" y="28" width="20" height="42" rx="5" fill="${f.md}" stroke="#4d545c"/>
      </g>`,
    sledge: f => `
      <g transform="rotate(-28 120 100)">
        <rect x="111" y="58" width="18" height="112" rx="8" fill="${f.w}"/>
        <rect x="111" y="132" width="18" height="38" rx="8" fill="${f.h}"/>
        <rect x="70" y="26" width="100" height="40" rx="7" fill="${f.k}"/>
        <rect x="62" y="24" width="14" height="44" rx="4" fill="${f.md}"/>
        <rect x="164" y="24" width="14" height="44" rx="4" fill="${f.md}"/>
      </g>`,
    saw: f => `
      <path d="M28 70 L160 50 L160 116 L28 104 Z" fill="${f.m}" stroke="#7d8690"/>
      <path d="M28 104 ${Array.from({ length: 22 }, (_, i) => `L${34 + i * 6} ${110 + i * 0.35} L${37 + i * 6} ${104 + i * 0.55}`).join(" ")} L160 116" fill="#9aa3ad"/>
      <path d="M44 80 L150 64" stroke="#fff" stroke-width="3" opacity=".6"/>
      <path d="M154 46 Q200 38 214 70 Q222 104 196 126 L158 124 Z" fill="${f.h}"/>
      <path d="M172 66 Q196 62 200 82 Q200 100 184 106 L172 104 Z" fill="#f1f3f6"/>
      <circle cx="164" cy="62" r="4" fill="${f.md}"/><circle cx="164" cy="108" r="4" fill="${f.md}"/>`,
    wrench: f => `
      <g transform="rotate(35 120 95)">
        <mask id="${f.id("wm")}"><rect width="240" height="180" fill="#fff"/><rect x="111" y="6" width="18" height="34" rx="3" fill="#000"/></mask>
        <g mask="url(#${f.id("wm")})">
          <circle cx="120" cy="38" r="27" fill="${f.m}" stroke="#7d8690"/>
          <rect x="110" y="50" width="20" height="112" rx="10" fill="${f.m}" stroke="#7d8690"/>
        </g>
        <rect x="113" y="110" width="14" height="48" rx="7" fill="${f.h}"/>
        <circle cx="120" cy="64" r="6" fill="${f.md}"/>
      </g>`,
    spanners: f => [-24, 0, 24].map((r, i) => `
      <g transform="rotate(${r} 120 170) translate(${(i - 1) * 6} 0)">
        <rect x="113" y="40" width="14" height="118" rx="7" fill="${f.m}" stroke="#7d8690"/>
        <path d="M108 22 h24 l4 22 h-8 l-2 -12 h-12 l-2 12 h-8 Z" fill="${f.m}" stroke="#7d8690"/>
        <rect x="114" y="120" width="12" height="34" rx="6" fill="${f.h}"/>
      </g>`).join(""),
    screwdriver: f => `
      <g transform="rotate(-32 120 96)">
        <rect x="117" y="18" width="7" height="82" rx="2" fill="${f.m}" stroke="#7d8690"/>
        <path d="M115 18 L126 18 L123 6 L118 6 Z" fill="#6f7882"/>
        <rect x="111" y="96" width="19" height="12" rx="3" fill="${f.md}"/>
        <rect x="104" y="104" width="33" height="64" rx="13" fill="${f.h}"/>
        <path d="M112 112 v48 M120 112 v50 M128 112 v48" stroke="${f.dark}" stroke-width="2.5" opacity=".4"/>
        <rect x="104" y="150" width="33" height="18" rx="9" fill="#2b2f35" opacity=".85"/>
      </g>`,
    chisel: f => `
      <g transform="rotate(-30 120 96)">
        <path d="M112 14 L128 14 L126 98 L114 98 Z" fill="${f.m}" stroke="#7d8690"/>
        <path d="M112 14 L128 14 L127 24 L113 24 Z" fill="#dfe4e9"/>
        <rect x="111" y="94" width="18" height="10" rx="2" fill="${f.md}"/>
        <path d="M108 102 Q106 140 110 168 L130 168 Q134 140 132 102 Z" fill="${f.w}"/>
        <rect x="108" y="160" width="24" height="10" rx="4" fill="${f.c}"/>
      </g>`,
    chiselSet: f => [-16, 0, 16].map((r, i) => `
      <g transform="rotate(${r} 120 168) translate(${(i - 1) * 4} 0)">
        <path d="M114 ${20 + i * 6} L126 ${20 + i * 6} L125 100 L115 100 Z" fill="${f.m}" stroke="#7d8690"/>
        <path d="M111 100 Q109 140 112 166 L128 166 Q131 140 129 100 Z" fill="${f.w}"/>
        <rect x="111" y="158" width="18" height="8" rx="3" fill="${f.c}"/>
      </g>`).join(""),
    tape: f => `
      <path d="M150 112 L222 112 L222 132 L150 132 Z" fill="#f6c945" stroke="#b8901f"/>
      <path d="${Array.from({ length: 14 }, (_, i) => `M${156 + i * 5} 112 v${i % 2 ? 6 : 10}`).join(" ")}" stroke="#4b3b0a" stroke-width="1.2"/>
      <rect x="216" y="108" width="8" height="28" rx="2" fill="${f.md}"/>
      <rect x="56" y="40" width="104" height="104" rx="26" fill="${f.hv}"/>
      <rect x="64" y="48" width="88" height="88" rx="20" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="108" cy="92" r="26" fill="${f.k}"/>
      <circle cx="108" cy="92" r="9" fill="${f.md}"/>
      <rect x="144" y="56" width="16" height="22" rx="4" fill="#2b2f35"/>`,
    square: f => `
      <path d="M50 30 L76 30 L76 128 L200 128 L200 154 L50 154 Z" fill="${f.m}" stroke="#7d8690"/>
      <path d="${Array.from({ length: 12 }, (_, i) => `M${84 + i * 10} 128 v-${i % 2 ? 8 : 14}`).join(" ")} ${Array.from({ length: 9 }, (_, i) => `M76 ${120 - i * 10} h${i % 2 ? 8 : 14}`).join(" ")}" stroke="#3a4047" stroke-width="1.5"/>
      <path d="M40 26 L86 26 L86 44 L40 44 Z" fill="${f.h}"/>`,
    goggles: f => `
      <path d="M30 86 Q30 70 52 70 L188 70 Q210 70 210 86" fill="none" stroke="#2b2f35" stroke-width="8" stroke-linecap="round"/>
      <path d="M48 66 Q120 50 192 66 Q202 104 168 116 Q140 124 124 104 Q120 100 116 104 Q100 124 72 116 Q38 104 48 66 Z" fill="${f.c}" stroke="${f.dark}" stroke-width="3"/>
      <path d="M58 72 Q86 64 112 70 Q110 102 86 108 Q60 106 58 72 Z" fill="#bfe3f7" opacity=".85"/>
      <path d="M128 70 Q154 64 182 72 Q180 106 154 108 Q130 102 128 70 Z" fill="#bfe3f7" opacity=".85"/>
      <path d="M66 76 Q80 72 92 74 M136 74 Q150 72 162 76" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,
    helmet: f => `
      <path d="M48 120 Q48 44 120 40 Q192 44 192 120 Z" fill="${f.hv}"/>
      <path d="M112 42 Q120 38 128 42 L130 118 L110 118 Z" fill="${f.light}" opacity=".6"/>
      <path d="M32 120 Q120 108 208 120 Q210 134 196 136 L44 136 Q30 134 32 120 Z" fill="${f.dark}"/>
      <path d="M70 70 Q90 54 110 52" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45"/>`,
    faceShield: f => `
      ${D.helmet(f)}
      <path d="M54 118 Q120 112 186 118 L180 164 Q120 172 60 164 Z" fill="#cfe8f7" opacity=".7" stroke="#8fb8cf" stroke-width="2"/>`,
    gloves: f => `
      <g transform="rotate(-12 120 100)">
        <path d="M88 160 L84 96 Q82 84 92 84 Q100 84 100 96 L100 60 Q100 48 110 48 Q120 48 120 60 L120 50 Q120 38 130 38 Q140 38 140 50 L140 60 Q140 50 150 50 Q160 50 160 62 L160 112 Q170 96 180 100 Q188 104 182 118 L160 160 Z" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
        <path d="M86 140 L160 140 L160 166 L88 166 Z" fill="#2b2f35"/>
        <path d="M110 62 v30 M130 54 v36 M150 64 v28" stroke="${f.dark}" stroke-width="2" opacity=".4"/>
      </g>`,
    earmuffs: f => `
      <path d="M62 96 Q62 26 120 26 Q178 26 178 96" fill="none" stroke="#2b2f35" stroke-width="12" stroke-linecap="round"/>
      <path d="M62 96 Q62 34 120 34 Q178 34 178 96" fill="none" stroke="${f.c}" stroke-width="5" stroke-linecap="round"/>
      <rect x="38" y="84" width="46" height="70" rx="22" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
      <rect x="156" y="84" width="46" height="70" rx="22" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
      <rect x="76" y="96" width="10" height="46" rx="5" fill="#2b2f35"/><rect x="154" y="96" width="10" height="46" rx="5" fill="#2b2f35"/>`,
    screws: f => [0, 1, 2].map(i => `
      <g transform="translate(${-44 + i * 44} ${i === 1 ? -8 : 6}) rotate(${-10 + i * 10} 120 100)">
        <ellipse cx="120" cy="44" rx="20" ry="8" fill="${f.m}" stroke="#7d8690"/>
        <rect x="102" y="36" width="36" height="8" fill="${f.m}"/>
        <ellipse cx="120" cy="36" rx="18" ry="7" fill="#e6eaee" stroke="#7d8690"/>
        <path d="M110 36 h20 M120 31 v10" stroke="#5d656e" stroke-width="2.5"/>
        <path d="M112 44 L128 44 L126 140 L120 158 L114 140 Z" fill="${f.m}" stroke="#7d8690"/>
        <path d="${Array.from({ length: 11 }, (_, j) => `M113 ${52 + j * 8} L127 ${48 + j * 8}`).join(" ")}" stroke="#7d8690" stroke-width="2"/>
      </g>`).join(""),
    nuts: f => [[84, 84, 30], [150, 70, 24], [140, 128, 26]].map(([x, y, r]) => {
      const pts = Array.from({ length: 6 }, (_, i) => `${x + r * Math.cos(Math.PI / 3 * i + Math.PI / 6)},${y + r * Math.sin(Math.PI / 3 * i + Math.PI / 6)}`).join(" ");
      return `<polygon points="${pts}" fill="${f.m}" stroke="#6f7882" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="#5d656e"/><circle cx="${x}" cy="${y}" r="${r * 0.32}" fill="#2b2f35"/>`;
    }).join(""),
    washers: f => [[86, 86, 32], [152, 74, 26], [140, 130, 24]].map(([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${f.m}" stroke="#6f7882" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="#e9eef3" stroke="#6f7882" stroke-width="2"/>`).join(""),
    cabinet: f => `
      <rect x="62" y="22" width="116" height="134" rx="8" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="70" y="${30 + i * 24}" width="100" height="20" rx="3" fill="${f.light}" opacity=".35" stroke="${f.dark}"/><rect x="104" y="${37 + i * 24}" width="32" height="6" rx="3" fill="${f.md}"/>`).join("")}
      <circle cx="74" cy="160" r="6" fill="#2b2f35"/><circle cx="166" cy="160" r="6" fill="#2b2f35"/>`,
    workbench: f => `
      <rect x="22" y="56" width="196" height="18" rx="3" fill="${f.w}"/>
      <path d="M30 62 h180" stroke="#6e4520" opacity=".35"/>
      <rect x="34" y="74" width="12" height="84" fill="${f.k}"/><rect x="194" y="74" width="12" height="84" fill="${f.k}"/>
      <rect x="34" y="132" width="172" height="8" fill="${f.k}"/>
      <rect x="120" y="76" width="74" height="52" rx="3" fill="${f.hv}" stroke="${f.dark}"/>
      <rect x="146" y="86" width="22" height="5" rx="2" fill="${f.md}"/><rect x="146" y="108" width="22" height="5" rx="2" fill="${f.md}"/>
      <path d="M120 102 h74" stroke="${f.dark}"/>`,
    toolbelt: f => `
      <path d="M14 70 Q120 92 226 70 L226 86 Q120 108 14 86 Z" fill="#7a4a24"/>
      <rect x="106" y="74" width="28" height="22" rx="3" fill="none" stroke="${f.md}" stroke-width="5"/>
      <rect x="40" y="88" width="62" height="66" rx="10" fill="#9a6232" stroke="#6b4020" stroke-width="2"/>
      <rect x="140" y="88" width="62" height="66" rx="10" fill="#9a6232" stroke="#6b4020" stroke-width="2"/>
      <rect x="52" y="54" width="10" height="40" rx="4" fill="${f.c}"/><rect x="70" y="60" width="8" height="34" rx="3" fill="${f.md}"/>
      <rect x="152" y="50" width="12" height="44" rx="5" fill="${f.c}"/><rect x="172" y="62" width="14" height="32" rx="2" fill="#f6c945"/>
      <path d="M46 112 h50 M146 112 h50" stroke="#6b4020" stroke-dasharray="4 3" stroke-width="2"/>`,
    sander: f => `
      <path d="M44 130 L196 130 L196 150 L44 150 Z" fill="${f.k}" rx="6"/>
      <path d="M50 130 Q50 70 120 66 Q186 66 192 130 Z" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
      <path d="M84 66 Q84 32 120 32 Q156 32 156 66" fill="none" stroke="#2b2f35" stroke-width="14" stroke-linecap="round"/>
      <path d="M74 110 h92" stroke="${f.dark}" stroke-width="3" opacity=".4"/>
      <rect x="168" y="80" width="38" height="20" rx="8" fill="#2b2f35"/>`,
    circularSaw: f => `
      <circle cx="104" cy="104" r="56" fill="${f.m}" stroke="#7d8690"/>
      <path d="${Array.from({ length: 36 }, (_, i) => { const a = i * Math.PI / 18; return `M${104 + 56 * Math.cos(a)} ${104 + 56 * Math.sin(a)} L${104 + 63 * Math.cos(a + 0.08)} ${104 + 63 * Math.sin(a + 0.08)}`; }).join(" ")}" stroke="#7d8690" stroke-width="3"/>
      <circle cx="104" cy="104" r="12" fill="${f.md}"/>
      <path d="M44 100 Q50 40 116 36 Q176 36 186 96 L186 116 L44 116 Z" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
      <path d="M150 50 Q206 30 214 76 L196 84 Q190 56 160 64 Z" fill="#2b2f35"/>
      <rect x="40" y="116" width="160" height="10" rx="3" fill="${f.md}"/>`,
    drill: f => `
      <path d="M64 46 L176 46 Q190 46 190 60 L190 82 Q190 94 176 94 L64 94 Z" fill="${f.hv}" stroke="${f.dark}" stroke-width="2"/>
      <rect x="40" y="54" width="28" height="32" rx="6" fill="#2b2f35"/>
      <path d="M40 60 L22 64 L22 76 L40 80 Z" fill="${f.m}" stroke="#7d8690"/>
      <rect x="4" y="68" width="20" height="4" fill="${f.md}"/>
      <path d="M128 94 L160 94 L150 138 L120 138 Z" fill="#2b2f35"/>
      <rect x="108" y="136" width="66" height="28" rx="6" fill="${f.k}"/>
      <rect x="112" y="140" width="58" height="8" rx="3" fill="${f.c}"/>
      <rect x="120" y="98" width="8" height="16" rx="3" fill="${f.c}"/>
      <path d="M150 56 h28 M150 64 h28 M150 72 h28" stroke="${f.dark}" stroke-width="2" opacity=".45"/>`,
    box: f => `<rect x="60" y="40" width="120" height="110" rx="10" fill="${f.hv}"/>`,
  };

  const kindOf = p => {
    const n = p.name.toLowerCase();
    if (/sledge/.test(n)) return "sledge";
    if (p.category === "Hammer") return "hammer";
    if (p.category === "Pliers") return "pliers";
    if (p.category === "Hand Saw") return "saw";
    if (/open-end/.test(n)) return "spanners";
    if (p.category === "Wrench") return "wrench";
    if (p.category === "Screwdriver") return "screwdriver";
    if (/set/.test(n) && p.category === "Chisels") return "chiselSet";
    if (p.category === "Chisels") return "chisel";
    if (/square/.test(n)) return "square";
    if (p.category === "Measures") return "tape";
    if (/goggle|glasses/.test(n)) return "goggles";
    if (/face shield/.test(n)) return "faceShield";
    if (/helmet/.test(n)) return "helmet";
    if (/glove/.test(n)) return "gloves";
    if (/ear/.test(n)) return "earmuffs";
    if (/washer/.test(n)) return "washers";
    if (/nut/.test(n)) return "nuts";
    if (p.category === "Fasteners") return "screws";
    if (p.category === "Storage Solutions") return "cabinet";
    if (p.category === "Workbench") return "workbench";
    if (p.category === "Tool Belts") return "toolbelt";
    if (p.category === "Sander") return "sander";
    if (p.category === "Saw") return "circularSaw";
    if (p.category === "Drill") return "drill";
    return "box";
  };

  const PALETTE = ["#e4572e", "#2e86ab", "#f3a712", "#3bb273", "#7768ae", "#d7263d", "#1b998b", "#ff7f11", "#3d5a80", "#c44536"];
  const hash = s => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const colorOf = p => {
    if (/goggle|helmet|glove|ear|shield/i.test(p.name)) return ["#f3a712", "#ff7f11", "#e4572e", "#3bb273"][hash(p.id) % 4];
    return PALETTE[hash(p.id) % PALETTE.length];
  };

  window.ART = {
    kindOf, colorOf, hash,
    product: p => svg(D[kindOf(p)], colorOf(p)),
    icon: (kind, color, opts) => svg(D[kind] || D.box, color, opts),
  };
})();
