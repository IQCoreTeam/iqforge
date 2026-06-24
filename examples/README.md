# IQForge — Visual Builder Study

Three MIT-licensed open-source builders, studied for how they model blocks, JSON state,
and HTML export — the three things IQForge's website builder needs.

## The three candidates

| | GrapesJS | Craft.js | Puck |
|---|---|---|---|
| **License** | BSD-3-Clause | MIT | MIT |
| **Model** | HTML/CSS tree | React node tree | Config + Data JSON |
| **Block definition** | `BlockManager.add(id, content)` | Component + `.craft` static | `config.components[name]` |
| **Settings panel** | built-in style manager | custom `related.settings` | auto-generated from `fields` |
| **JSON state** | `getProjectData()` / `loadProjectData()` | `query.serialize()` / `actions.deserialize()` | `data: Data` prop |
| **HTML export** | `getHtml()` + `getCss()` (native) | `renderToStaticMarkup` (manual) | `renderToString(<Render/>)` |
| **Framework** | vanilla JS (works anywhere) | React-required | React-required |
| **No-build option** | Yes (CDN `<script>`) | No | No |
| **IQForge fit** | ★★★★ | ★★★ | ★★★★★ |

## Key learnings

### Block modeling
All three converge on the same idea: **a block is an identifier + a set of editable props**.
- GrapesJS: `{ id, content: HTMLString | descriptor, category, label, media }`
- Craft.js:  React component with `.craft = { displayName, props, related }`
- Puck:      `{ fields, defaultProps, render }` in the config object

**IQForge should adopt Puck's config-object pattern** — it's the most declarative and
matches the existing "templates are data" design in `lib/templates.ts`.

### JSON state
All three serialize editor state to plain JSON. The shape:
- GrapesJS: `{ pages: [...], styles: [...], assets: [...] }` — includes style rules
- Craft.js: `{ ROOT: { type, nodes, props }, nodeId: { ... } }` — node tree
- Puck:     `{ content: [{ type, props }], root: { props }, zones: {} }` — flat list

**IQForge's `iqpages.json`** should be the Puck `Data` object — flat, readable,
easy to diff on-chain, and directly loadable back into the editor.

### HTML export
This is where Puck wins cleanly:
```tsx
// The same config that powers the editor also powers static render
import { renderToString } from 'react-dom/server';
import { Render } from '@measured/puck';

const html = renderToString(<Render config={config} data={data} />);
// Wrap in <html><head>...</head><body>{html}</body></html> → index.html
```

GrapesJS is also clean (`getHtml()` + `getCss()`), but requires keeping the full
GrapesJS runtime loaded. Puck's `Render` is a tiny dependency.

## Recommended architecture for IQForge Step 4

```
app/build/website/page.tsx          ← new page: visual website builder
  └─ <Puck config={iqConfig} data={pageData} onPublish={publish} />

lib/iq-puck-config.ts               ← IQForge block library as a Puck Config
  └─ components: { HeroSection, TextBlock, Gallery, TwoColumns, CTAButton, ... }

lib/iqlabs.ts (already updated)     ← git-sdk commit triggered from onPublish
  └─ publishWebsite(wallet, connection, data: Data)
       → renderToString(<Render config data />) → index.html
       → JSON.stringify(data)        → iqpages.json
       → client.commit('site-name', [index.html, iqpages.json])
```

### Publish flow (complete)
```
User edits in Puck → clicks Publish
→ onPublish(data: Data)
→ renderToString(<Render config={iqConfig} data={data} />) → html string
→ git-sdk: client.commit('site-name', 'publish', [
    { path: 'index.html',   content: htmlDoc },
    { path: 'iqpages.json', content: JSON.stringify(data) },
  ])
→ deployPages() → manifestSig
→ SNS Url record = manifestSig
→ gateway serves /site/{manifestSig}
```

## Running the examples

```bash
# GrapesJS (no install needed)
cd examples/grapesjs && open index.html
# or: npx serve examples/grapesjs

# Craft.js
cd examples/craftjs && npm install && npm run dev

# Puck
cd examples/puck && npm install && npm run dev
```
