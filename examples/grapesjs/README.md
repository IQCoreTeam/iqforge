# GrapesJS Study

**License**: BSD-3-Clause (compatible — verify before adopting)  
**Site**: https://grapesjs.com  
**Repo**: https://github.com/GrapesJS/grapesjs

## Run

No build step needed — open `index.html` directly in a browser (or serve with `npx serve .`).

## What this example shows

| Concept | API | IQForge equivalent |
|---|---|---|
| Custom blocks | `BlockManager.add(id, { content, media, category })` | one entry per IQForge block type |
| Custom component type | `DomComponents.addType(id, { model })` | per-family defaults, traits, drag rules |
| Save state | `editor.getProjectData()` → JSON | store as `iqpages.json` via git-sdk |
| Load state | `editor.loadProjectData(json)` | restore draft from on-chain blob |
| Export HTML | `editor.getHtml()` + `editor.getCss()` | build the `index.html` committed to chain |

## Key patterns

### Block definition
```js
editor.BlockManager.add('my-block', {
  label: 'My Block',
  category: 'Section',
  media: '<svg>...</svg>',   // icon shown in block panel
  content: '<div>...</div>', // HTML string OR component descriptor object
});
```

### Custom component type (gives blocks traits, default styles, drop rules)
```js
editor.DomComponents.addType('my-block', {
  model: {
    defaults: {
      tagName: 'section',
      droppable: true,
      traits: [ { name: 'data-scheme', type: 'select', options: [...] } ],
      style: { background: '#000', color: '#fff' },
    },
  },
});
```

### JSON round-trip
```js
// save
const json = editor.getProjectData();        // { pages, styles, assets, ... }
localStorage.setItem('project', JSON.stringify(json));

// load
editor.loadProjectData(JSON.parse(saved));
```

### HTML export (what goes on-chain)
```js
const html = editor.getHtml();  // inner body content
const css  = editor.getCss();   // all style rules

const indexHtml = `<!DOCTYPE html>
<html><head><style>${css}</style></head>
<body>${html}</body></html>`;

// → commit via git-sdk:
// await client.commit('my-site', 'publish', [
//   { path: 'index.html', content: indexHtml },
//   { path: 'iqpages.json', content: JSON.stringify(editor.getProjectData()) },
// ]);
```

## Verdict for IQForge

GrapesJS is the closest fit to what IQForge's website builder needs:
- Block panel + canvas + style panel are already built
- JSON state → `iqpages.json` on chain = draft persistence
- `getHtml()` + `getCss()` → `index.html` on chain = published site
- Custom block types map 1:1 to IQForge's existing template sections

**The pattern**: wrap GrapesJS in a Next.js page, register IQForge's block library,
wire Save → git-sdk commit, wire Publish → set `.sol` Url record.
