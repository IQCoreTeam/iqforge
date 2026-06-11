# examples/ — Open-source builder study (ZO_PLAN §2/§4)

Goal per Zo: don't hand-build a visual editor blind — study how the good OSS
builders model blocks, persist projects as JSON, and emit HTML/CSS, then build
ours to that standard. Findings below are from reading the actual source
(file refs included), not the marketing pages.

## License verdicts (checked in-repo)

| Builder | License | Vendored here? |
|---|---|---|
| Craft.js (`prevwong/craft.js`) | MIT | ✅ `examples/craft.js` |
| Puck (`puckeditor/puck`) | MIT | ✅ `examples/puck` |
| GrapesJS (`GrapesJS/grapesjs`) | BSD-3-Clause (not MIT) | ❌ studied, not vendored (per the MIT-only rule). BSD-3 is permissive, so this is a policy call we can revisit. |

Sources are pulled by `./pull-examples.sh` (they're ~20MB combined, so they are
not committed / not shipped in delivery zips — run the script locally).

## How each one models the problem

### GrapesJS — the HTML-native one
- **State**: a component tree of its own Model objects; whole project persists
  via `editor.getProjectData()` / `loadProjectData(json)` (packages/core/src/editor/index.ts:551).
- **Export**: first-class `editor.getHtml()` + `editor.getCss()`
  (editor/index.ts:252,268) — it thinks in HTML/CSS natively, which is exactly
  our publish format.
- **Blocks**: BlockManager registers `{ id, label, content }` where content is
  HTML or a component def. Closest to a classic site builder.
- Takeaway: best conceptual match for "edit → export clean HTML → push", but
  it's a large vanilla-JS app you embed, not React-native; theming the editor
  UI to IQForge's look is the fight.

### Craft.js — the React-native framework (not a builder)
- **State**: a flat `SerializedNodes = Record<NodeId, SerializedNode>` map —
  each node = `{ type (resolved component name), props, parent, nodes[],
  linkedNodes }` (packages/core/src/interfaces/nodes.ts:78-84). Serialize with
  `query.serialize()` → JSON string; rehydrate via resolver map.
- **Export**: none built-in — you render the node tree with React. HTML export
  = `renderToStaticMarkup` over the deserialized tree (we already do exactly
  this for templates, so our pipeline slots in unchanged).
- Takeaway: lowest-level, most control, most work. It's a framework for
  building an editor, not an editor.

### Puck — the React-native product (closest to what we'd ship)
- **State**: `Data = { root, content: ComponentData[], zones? }` where each
  ComponentData is `{ type, props }` (packages/core/types/Data.tsx:69-76).
  Plain JSON document, trivially stored onchain.
- **Config**: `Config = { components: { [name]: { fields, defaultProps,
  render } } }` — fields drive an auto-generated form. **This is the same
  philosophy as our TemplateField schema** — Puck is our customizer
  generalized to arbitrary block composition.
- **Export**: `<Render config data />` server-side → static HTML via React,
  same as our export path.
- Takeaway: the natural evolution target. Our `SiteContent` ≈ a Puck `Data`
  with one implicit root component; our field groups ≈ Puck fields.

## Recommendation for OUR editor (v2)

Build Puck-shaped, render-our-way:
1. Adopt a **document model = `{ root, content: [{type, props}] }`** (Puck's
   shape) as the website-builder state. It's JSON → commits cleanly via
   git-sdk alongside index.html.
2. Keep our **schema-driven field system** as the per-block prop editor — it
   already exists and matches Puck's `fields` concept 1:1.
3. Export stays `renderToStaticMarkup` + embedded compiled CSS (current
   pipeline, unchanged) — GrapesJS validates the "HTML is the artifact"
   instinct; Craft.js shows the node-tree mechanics if we outgrow Puck's model.
4. Concrete v2 step: define `BLOCK_REGISTRY` (hero, text, image, gallery,
   links, embed …) with the same `{fields, defaultProps, render}` triple Puck
   uses, then a column of stacked blocks with add/remove/reorder — drag-and-
   drop can come after stacking works.
