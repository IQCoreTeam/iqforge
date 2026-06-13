// The single render path. A Site -> one self-contained index.html string.
// Used by the live preview (iframe srcDoc) and by publish (becomes index.html).
// Having one renderer means the preview is byte-identical to what ships on-chain.
//
// Images live in content as data-URIs, so the output is fully self-contained —
// one manifest entry, nothing else to fetch. (Splitting large media into
// separate manifest files is a later optimization; not needed for MVP pages.)

import type { Site, SiteTheme, SiteContent, Archetype } from "./types";

function esc(s = ""): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}

/** background can be a hex color, a CSS gradient, or a data-URI image. */
function bgCss(bg: string): string {
  if (bg.startsWith("data:")) return `#070b09 url("${bg}") center/cover no-repeat fixed`;
  return bg; // color or gradient
}

const FONTS: Record<SiteTheme["font"], { stack: string; import: string }> = {
  sans: { stack: `"Inter", system-ui, sans-serif`, import: "Inter:wght@400;500;600;800" },
  mono: { stack: `"JetBrains Mono", ui-monospace, monospace`, import: "JetBrains+Mono:wght@400;500;700" },
  serif: { stack: `"Fraunces", Georgia, serif`, import: "Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900" },
};

function baseCss(theme: SiteTheme): string {
  const f = FONTS[theme.font];
  const ink = theme.mode === "dark" ? "#e9fdf0" : "#0b0f0d";
  const sub = theme.mode === "dark" ? "rgba(233,253,240,.62)" : "rgba(11,15,13,.62)";
  const surface = theme.mode === "dark" ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)";
  const line = theme.mode === "dark" ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.12)";
  return `@import url('https://fonts.googleapis.com/css2?family=${f.import}&display=swap');
:root{--accent:${theme.accent};--ink:${ink};--sub:${sub};--surface:${surface};--line:${line}}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:${f.stack};color:var(--ink);background:${bgCss(theme.background)};line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:840px;margin:0 auto;padding:64px 24px 96px}
.wide{max-width:1080px}
a{color:var(--accent);text-decoration:none}
img{max-width:100%;display:block}
h1{font-size:clamp(2.2rem,6vw,3.6rem);line-height:1.05;letter-spacing:-.02em;font-weight:800}
h2{font-size:1.5rem;letter-spacing:-.01em;margin-bottom:14px;font-weight:700}
h3{font-size:1.05rem;font-weight:600}
.sub{color:var(--sub)}
.tag{display:inline-block;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);border-radius:999px;padding:6px 14px;margin-bottom:22px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 20px;border-radius:12px;font-weight:600;border:1px solid var(--line);background:var(--surface);color:var(--ink);transition:.15s}
.btn:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--accent) 60%,transparent)}
.btn-primary{background:var(--accent);color:#04130a;border-color:transparent;box-shadow:0 0 30px -8px var(--accent)}
.avatar{width:128px;height:128px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);box-shadow:0 0 40px -10px var(--accent);margin:0 auto 26px}
.grid{display:grid;gap:16px}
.cols-2{grid-template-columns:repeat(2,1fr)}
.cols-3{grid-template-columns:repeat(3,1fr)}
.stack>*+*{margin-top:14px}
.section{margin-top:56px}
.row{display:flex;flex-wrap:wrap;gap:12px}
.center{text-align:center}
.footer{margin-top:72px;padding-top:24px;border-top:1px solid var(--line);font-size:.85rem;color:var(--sub);text-align:center}
.badge-iq{display:inline-flex;gap:6px;align-items:center;font-size:.72rem;color:var(--sub);opacity:.7}
.hero-img{width:100%;border-radius:20px;border:1px solid var(--line);aspect-ratio:16/9;object-fit:cover}
.split{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
.stat{font-size:1.7rem;font-weight:800;color:var(--accent)}
.mono-box{font-family:ui-monospace,monospace;font-size:.85rem;word-break:break-all;background:var(--surface);border:1px dashed var(--line);border-radius:12px;padding:12px 14px}
.gallery img{border-radius:14px;aspect-ratio:1;object-fit:cover;border:1px solid var(--line)}
.cap{font-size:.85rem;color:var(--sub);margin-top:6px}
.post+.post{margin-top:18px}
.date{font-size:.78rem;color:var(--accent);letter-spacing:.06em;text-transform:uppercase}
@media(max-width:680px){.cols-2,.cols-3,.split{grid-template-columns:1fr}.wrap{padding:40px 18px 72px}}`;
}

const link = (l: { label: string; url: string }, primary = false) =>
  `<a class="btn${primary ? " btn-primary" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`;

const socialRow = (c: SiteContent) =>
  c.socials.length ? `<div class="row center" style="justify-content:center;margin-top:22px">${c.socials.map((s) => link(s)).join("")}</div>` : "";

function spotlight(c: SiteContent): string {
  return `<div class="wrap center">
${c.tagline ? `<span class="tag">${esc(c.tagline)}</span>` : ""}
${c.avatar ? `<img class="avatar" src="${esc(c.avatar)}" alt="">` : ""}
<h1>${esc(c.title)}</h1>
${c.bio ? `<p class="sub" style="max-width:560px;margin:18px auto 0;font-size:1.1rem">${esc(c.bio)}</p>` : ""}
${c.links.length ? `<div class="stack" style="max-width:440px;margin:34px auto 0">${c.links.map((l, i) => link(l, i === 0)).join("")}</div>` : ""}
${socialRow(c)}
</div>`;
}

function cover(c: SiteContent): string {
  return `<div class="wrap wide">
<div class="split">
<div>
${c.tagline ? `<span class="tag">${esc(c.tagline)}</span>` : ""}
<h1>${esc(c.title)}</h1>
${c.bio ? `<p class="sub" style="margin-top:18px;font-size:1.1rem">${esc(c.bio)}</p>` : ""}
<div class="row" style="margin-top:28px">${c.ctaLabel ? link({ label: c.ctaLabel, url: c.ctaUrl }, true) : ""}${c.links.map((l) => link(l)).join("")}</div>
</div>
<div>${c.heroImage ? `<img class="hero-img" src="${esc(c.heroImage)}" alt="">` : `<div class="card" style="aspect-ratio:1"></div>`}</div>
</div>
${c.features.length ? `<div class="section grid cols-3">${c.features.map((f) => `<div class="card"><h3 style="color:var(--accent)">${esc(f.title)}</h3><p class="sub" style="margin-top:8px">${esc(f.body)}</p></div>`).join("")}</div>` : ""}
${socialRow(c)}
</div>`;
}

function token(c: SiteContent): string {
  return `<div class="wrap center">
${c.ticker ? `<span class="tag">$${esc(c.ticker)}</span>` : ""}
${c.avatar ? `<img class="avatar" src="${esc(c.avatar)}" alt="">` : ""}
<h1>${esc(c.title)}</h1>
${c.bio ? `<p class="sub" style="max-width:600px;margin:18px auto 0;font-size:1.15rem">${esc(c.bio)}</p>` : ""}
<div class="row center" style="justify-content:center;margin-top:30px">${c.ctaLabel ? link({ label: c.ctaLabel, url: c.ctaUrl }, true) : ""}${c.links.map((l) => link(l)).join("")}</div>
${c.contract ? `<div class="section"><div class="mono-box">${esc(c.contract)}</div><div class="cap">Contract address</div></div>` : ""}
${c.stats.length ? `<div class="section grid cols-3">${c.stats.map((s) => `<div class="card"><div class="stat">${esc(s.value)}</div><div class="sub" style="margin-top:4px">${esc(s.label)}</div></div>`).join("")}</div>` : ""}
${c.roadmap.length ? `<div class="section"><h2>Roadmap</h2><div class="grid">${c.roadmap.map((r) => `<div class="card" style="text-align:left"><div class="date">${esc(r.phase)}</div><h3 style="margin-top:6px">${esc(r.title)}</h3><p class="sub" style="margin-top:6px">${esc(r.body)}</p></div>`).join("")}</div></div>` : ""}
${socialRow(c)}
</div>`;
}

function gallery(c: SiteContent): string {
  return `<div class="wrap wide center">
${c.tagline ? `<span class="tag">${esc(c.tagline)}</span>` : ""}
<h1>${esc(c.title)}</h1>
${c.bio ? `<p class="sub" style="max-width:620px;margin:18px auto 0;font-size:1.1rem">${esc(c.bio)}</p>` : ""}
${c.mintInfo ? `<div class="section"><div class="card" style="display:inline-block">${esc(c.mintInfo)}</div></div>` : ""}
<div class="row center" style="justify-content:center;margin-top:26px">${c.ctaLabel ? link({ label: c.ctaLabel, url: c.ctaUrl }, true) : ""}${c.links.map((l) => link(l)).join("")}</div>
${c.gallery.length ? `<div class="section grid cols-3 gallery">${c.gallery.map((g) => `<figure>${g.image ? `<img src="${esc(g.image)}" alt="">` : ""}${g.caption ? `<figcaption class="cap">${esc(g.caption)}</figcaption>` : ""}</figure>`).join("")}</div>` : ""}
${c.roadmap.length ? `<div class="section"><h2 class="center">Roadmap</h2><div class="grid cols-2" style="margin-top:18px">${c.roadmap.map((r) => `<div class="card" style="text-align:left"><div class="date">${esc(r.phase)}</div><h3 style="margin-top:6px">${esc(r.title)}</h3><p class="sub" style="margin-top:6px">${esc(r.body)}</p></div>`).join("")}</div></div>` : ""}
${socialRow(c)}
</div>`;
}

function feed(c: SiteContent): string {
  return `<div class="wrap">
<div class="center">
${c.tagline ? `<span class="tag">${esc(c.tagline)}</span>` : ""}
<h1>${esc(c.title)}</h1>
${c.bio ? `<p class="sub" style="max-width:560px;margin:16px auto 0">${esc(c.bio)}</p>` : ""}
${socialRow(c)}
</div>
<div class="section">${c.posts.map((p) => `<article class="post card" style="text-align:left"><div class="date">${esc(p.date)}</div><h3 style="margin-top:6px;font-size:1.25rem">${esc(p.title)}</h3><p class="sub" style="margin-top:8px">${esc(p.excerpt)}</p></article>`).join("")}</div>
</div>`;
}

const BODY: Record<Archetype, (c: SiteContent) => string> = {
  spotlight,
  cover,
  token,
  gallery,
  feed,
};

/** Render a full, self-contained HTML document for a Site. */
export function renderSiteHtml(site: Site): string {
  const c = site.content;
  const body = BODY[site.archetype](c);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.title || site.name)}</title>
<meta name="description" content="${esc(c.bio)}">
<style>${baseCss(site.theme)}</style>
</head>
<body>
${body}
<footer class="footer">${esc(c.footer || c.title)}
<div class="badge-iq" style="justify-content:center;margin-top:10px">⛓ stored on-chain with IQLabs${site.domain ? ` · ${esc(site.domain)}` : ""}</div>
</footer>
</body>
</html>`;
}
