// GrapesJS Study: custom blocks, JSON state, HTML export
// Everything IQForge needs is demonstrated below.

const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  width: 'auto',
  fromElement: false,
  storageManager: false, // we manage save/load manually

  // ── Canvas default content ──────────────────────────────────────────────
  components: `
    <section data-gjs-type="iq-hero">
      <h1>My IQForge Site</h1>
      <p>Drag blocks from the panel on the left to build your page.</p>
    </section>
  `,
  style: `
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #f8fafc; }
    section { padding: 40px 24px; border-radius: 8px; }
    [data-gjs-type="iq-hero"] { background: linear-gradient(135deg,#1a1a2e,#16213e); color: #e2e8f0; text-align: center; }
    [data-gjs-type="iq-hero"] h1 { font-size: 2.5rem; margin-bottom: 12px; }
    [data-gjs-type="iq-hero"] p  { opacity: .7; }
  `,

  // ── Block manager ────────────────────────────────────────────────────────
  blockManager: {
    appendTo: '#blocks',
    blocks: [],
  },

  // ── Style manager ────────────────────────────────────────────────────────
  styleManager: {
    sectors: [
      {
        name: 'Dimension',
        open: false,
        properties: ['width', 'height', 'padding', 'margin'],
      },
      {
        name: 'Typography',
        open: false,
        properties: ['font-family', 'font-size', 'font-weight', 'color', 'text-align'],
      },
      {
        name: 'Background',
        open: false,
        properties: ['background-color'],
      },
    ],
  },
});

// ── Register custom IQForge blocks ───────────────────────────────────────────
//
// Pattern: BlockManager.add(id, { label, category, content|render })
// `content` is HTML string, or use `render` for dynamic blocks.
// This is the block model IQForge should adopt — each block is:
//   { id, label, category, content: HTMLString, media: svgIcon }

const bm = editor.BlockManager;

bm.add('iq-hero', {
  label: 'Hero Section',
  category: 'IQForge',
  media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M8 12h8M8 8h8M8 16h4"/>
  </svg>`,
  content: {
    type: 'iq-hero',
    components: [
      { tagName: 'h1', content: 'Hero Title' },
      { tagName: 'p',  content: 'Subtitle text goes here.' },
    ],
  },
});

bm.add('iq-text', {
  label: 'Text Block',
  category: 'IQForge',
  media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 6h16M4 10h16M4 14h10"/>
  </svg>`,
  content: '<p style="padding:16px;font-size:1rem;line-height:1.6">Edit this text...</p>',
});

bm.add('iq-image', {
  label: 'Image',
  category: 'IQForge',
  media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>`,
  content: {
    type: 'image',
    style: { width: '100%', borderRadius: '8px' },
  },
  activate: true,
});

bm.add('iq-two-col', {
  label: '2 Columns',
  category: 'IQForge',
  media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="2" y="4" width="9" height="16" rx="1"/>
    <rect x="13" y="4" width="9" height="16" rx="1"/>
  </svg>`,
  content: `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px">
      <div style="padding:16px;background:#f1f5f9;border-radius:6px">Column 1</div>
      <div style="padding:16px;background:#f1f5f9;border-radius:6px">Column 2</div>
    </div>`,
});

bm.add('iq-cta', {
  label: 'Call to Action',
  category: 'IQForge',
  media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="2" y="8" width="20" height="8" rx="4"/>
    <path d="M8 12h8"/>
  </svg>`,
  content: `
    <div style="text-align:center;padding:40px 24px;background:#eff6ff;border-radius:8px">
      <h2 style="margin-bottom:12px;font-size:1.5rem">Ready to go on-chain?</h2>
      <a href="#" style="display:inline-block;padding:12px 28px;background:#3b82f6;color:#fff;
         border-radius:6px;text-decoration:none;font-weight:600">
        Publish now
      </a>
    </div>`,
});

// ── Register a custom component type ────────────────────────────────────────
//
// Custom types let blocks have their own default styles, traits, and drag rules.
// IQForge can create an 'iq-hero', 'iq-gallery', 'iq-links' type for each block family.

editor.DomComponents.addType('iq-hero', {
  model: {
    defaults: {
      tagName: 'section',
      attributes: { 'data-gjs-type': 'iq-hero' },
      droppable: true,
      stylable: true,
      traits: [
        { name: 'data-scheme', label: 'Color scheme', type: 'select',
          options: [
            { id: 'dark',  label: 'Dark' },
            { id: 'light', label: 'Light' },
          ]
        },
      ],
      style: {
        background: 'linear-gradient(135deg,#1a1a2e,#16213e)',
        color: '#e2e8f0',
        'text-align': 'center',
        padding: '60px 24px',
        'border-radius': '8px',
      },
    },
  },
});

// ── Save / Load / Export ────────────────────────────────────────────────────
//
// KEY INSIGHT for IQForge:
//   editor.getProjectData()  →  full JSON (components + styles + pages)
//   editor.loadProjectData() →  restore from JSON
//   editor.getHtml()         →  clean HTML string (inner canvas content)
//   editor.getCss()          →  all style rules
//   → wrap in a full HTML document = our index.html to commit via git-sdk

function getHtmlDocument() {
  const html = editor.getHtml();
  const css  = editor.getCss();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>My IQForge Site</title>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`;
}

// toolbar buttons
document.getElementById('btn-save').addEventListener('click', () => {
  const projectJson = editor.getProjectData();
  const json = JSON.stringify(projectJson, null, 2);
  localStorage.setItem('iqforge-grapesjs-project', json);
  showPanel(json);
  console.log('[GrapesJS] project saved to localStorage:', projectJson);
});

document.getElementById('btn-load').addEventListener('click', () => {
  const saved = localStorage.getItem('iqforge-grapesjs-project');
  if (!saved) { alert('Nothing saved yet — click Save first.'); return; }
  editor.loadProjectData(JSON.parse(saved));
  console.log('[GrapesJS] project loaded');
});

document.getElementById('btn-export').addEventListener('click', () => {
  const doc = getHtmlDocument();
  showPanel(doc);
  // In IQForge: pass `doc` to publishToIQLabs() → git-sdk commit
  console.log('[GrapesJS] exported HTML:\n', doc);
});

document.getElementById('btn-clear').addEventListener('click', () => {
  editor.setComponents('');
  editor.setStyle('');
  localStorage.removeItem('iqforge-grapesjs-project');
});

document.getElementById('json-close').addEventListener('click', () => {
  document.getElementById('json-panel').classList.remove('open');
});

function showPanel(text) {
  const panel = document.getElementById('json-panel');
  document.getElementById('json-content').textContent = text;
  panel.classList.add('open');
}

// ── Events to study ─────────────────────────────────────────────────────────
editor.on('component:add',    c => console.log('[GrapesJS] component added:', c.get('type')));
editor.on('component:remove', c => console.log('[GrapesJS] component removed:', c.get('type')));
editor.on('style:change',     () => console.log('[GrapesJS] styles changed'));
