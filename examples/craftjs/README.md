# Craft.js Study

**License**: MIT  
**Repo**: https://github.com/prevwong/craft.js

## Run

```bash
npm install
npm run dev
```

## What this example shows

| Concept | API | IQForge equivalent |
|---|---|---|
| Component registration | `<Editor resolver={{ Text, Container }}>` | maps component names → constructors |
| Draggable block | `connectors.create(ref, <Component />)` | toolbox drag source |
| Canvas | `<Frame><Element is={Root} canvas /></Frame>` | the editable page surface |
| Save state | `query.serialize()` → JSON string | store as `iqpages.json` |
| Load state | `actions.deserialize(json)` | restore from chain blob |
| HTML export | `renderToStaticMarkup` on the resolved tree | build `index.html` |

## Key patterns

### Component definition
```tsx
// A Craft.js component = a React component + a `.craft` static property
function Text({ text, fontSize, color }) {
  const { connectors: { connect, drag } } = useNode();
  return <p ref={ref => connect(drag(ref))} style={{ fontSize, color }}>{text}</p>;
}

Text.craft = {
  displayName: 'Text',
  props: { text: 'Default text', fontSize: 16, color: '#000' }, // default props
  related: { settings: TextSettings },  // settings panel component
};
```

### Pre-composed block (like a "Hero Section")
```tsx
// Wrap with <Element> to make it a canvas-registered node
function HeroBlock() {
  return (
    <Element is={Container} background="#1a1a2e" padding={60} canvas>
      <Text text="Hero Title" fontSize={36} color="#fff" />
    </Element>
  );
}
```

### JSON round-trip
```tsx
const { query, actions } = useEditor();

// Save: full node tree as JSON
const json = query.serialize();
localStorage.setItem('project', json);

// Load: restore full tree
actions.deserialize(savedJson);
```

### HTML export
```tsx
// Craft.js doesn't have a built-in HTML exporter.
// The node tree is a descriptor — render it with React:
import { renderToStaticMarkup } from 'react-dom/server';

// Walk query.getSerializedNodes(), rebuild the React tree, then:
const html = renderToStaticMarkup(<ResolvedTree />);
```

## Verdict for IQForge

Craft.js is **React-native** which aligns with IQForge's Next.js stack, but the HTML
export story is harder — you have to walk the node tree and render it yourself.
GrapesJS has a simpler `getHtml()` call.

**Best used for**: building a React-component-based editor where the output is also
a React app (or SSR'd). If IQForge ever ships a React site builder (where each block
is a real React component that ships to the user), Craft.js is the right model.

For **export-to-static-HTML** (IQForge's current goal), GrapesJS is simpler.
