# Puck Study

**License**: MIT  
**Repo**: https://github.com/measuredco/puck

## Run

```bash
npm install
npm run dev
```

## What this example shows

| Concept | API | IQForge equivalent |
|---|---|---|
| Block definition | `config.components['Name'] = { fields, defaultProps, render }` | one entry per IQForge block |
| Field types | `text`, `textarea`, `number`, `select`, `array`, `object`, `radio` | maps to a settings form automatically |
| Editor | `<Puck config={config} data={data} onPublish={save} />` | drop into a Next.js page |
| Save state | `onPublish(data: Data)` callback — `data` is plain JSON | store as `iqpages.json` |
| Load state | pass `data` prop | restore from chain blob |
| Read-only render | `<Render config={config} data={data} />` | preview + HTML export |
| HTML export | `renderToString(<Render config={config} data={data} />)` | build `index.html` for git-sdk |

## Key patterns

### Block definition (config-first, cleanest of the three)
```ts
const config: Config = {
  components: {
    HeroSection: {
      fields: {
        title:  { type: 'text',   label: 'Title' },
        scheme: { type: 'select', label: 'Scheme',
                  options: [{ value: 'dark', label: 'Dark' }, ...] },
      },
      defaultProps: { title: 'My Hero', scheme: 'dark' },
      render: ({ title, scheme }) => <section style={schemeStyles[scheme]}><h1>{title}</h1></section>,
    },
  },
};
```

### Data shape (the JSON state)
```ts
const data: Data = {
  content: [
    { type: 'HeroSection', props: { id: 'hero-1', title: 'Hello', scheme: 'dark' } },
    { type: 'TextBlock',   props: { id: 'text-1', text: 'World', fontSize: 16 } },
  ],
  root:  { props: {} },
  zones: {},  // for nested drop zones
};
```

### HTML export (server or browser)
```tsx
import { renderToString } from 'react-dom/server';
import { Render } from '@measured/puck';

const bodyHtml = renderToString(<Render config={config} data={data} />);

const indexHtml = `<!DOCTYPE html>
<html><head>...</head><body>${bodyHtml}</body></html>`;

// → git-sdk commit:
// await client.commit('my-site', 'publish', [
//   { path: 'index.html',   content: indexHtml },
//   { path: 'iqpages.json', content: JSON.stringify(data) },
// ]);
```

## Verdict for IQForge

Puck is the **best fit** for IQForge's website builder path because:

1. **Config-first** — blocks are pure data + render functions. Matches IQForge's existing "templates are data" philosophy exactly.
2. **`<Render />` component** — same config that powers the editor also powers read-only render. `renderToString(<Render .../>)` → clean HTML. This is the exact export flow IQForge needs.
3. **`onPublish` callback** — clean hook for "user clicks Publish → we fire git-sdk commit".
4. **Field types** map directly to the settings panel UI without any boilerplate.
5. **MIT licensed** — clean to use.

**Recommended path for IQForge Step 4**: wrap Puck in `app/build/[templateId]/page.tsx`,
define IQForge's block library as a Puck `Config`, wire `onPublish` to the git-sdk commit
flow in `lib/iqlabs.ts`.
