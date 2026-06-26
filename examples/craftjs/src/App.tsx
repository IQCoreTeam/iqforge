import React, { useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { renderToStaticMarkup } from 'react-dom/server';
import { Text } from './components/Text';
import { Container, HeroBlock } from './components/Container';

// ── Toolbox: draggable block library ────────────────────────────────────────
function Toolbox() {
  const { connectors } = useEditor();
  const btnStyle: React.CSSProperties = {
    padding: '8px 12px', margin: '4px 0', background: '#1e293b', color: '#e2e8f0',
    border: '1px solid #334155', borderRadius: 6, cursor: 'grab', fontSize: 13, width: '100%',
  };
  return (
    <div style={{ width: 180, padding: 12, borderRight: '1px solid #1e293b', flexShrink: 0 }}>
      <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Blocks</p>
      <button style={btnStyle}
        ref={ref => connectors.create(ref!, <Text text="New text block" />)}>
        Text
      </button>
      <button style={btnStyle}
        ref={ref => connectors.create(ref!, <Element is={Container} canvas />)}>
        Container
      </button>
      <button style={btnStyle}
        ref={ref => connectors.create(ref!, <HeroBlock />)}>
        Hero Section
      </button>
    </div>
  );
}

// ── Settings panel: selected component props ─────────────────────────────────
function SettingsPanel() {
  const { selected, actions } = useEditor((state) => {
    const [id] = state.events.selected;
    if (!id) return { selected: null };
    const node = state.nodes[id];
    return {
      selected: {
        id,
        name: node.data.displayName || node.data.name,
        settings: node.related?.settings,
      },
    };
  });

  if (!selected) return (
    <div style={{ padding: 12, fontSize: 12, color: '#64748b' }}>
      Click a component to edit it
    </div>
  );

  return (
    <div style={{ padding: 12 }}>
      <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{selected.name}</p>
      {selected.settings ? React.createElement(selected.settings) : null}
      <button onClick={() => actions.delete(selected.id)} style={{
        marginTop: 12, padding: '6px 10px', background: '#ef4444', color: '#fff',
        border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, width: '100%',
      }}>
        Delete
      </button>
    </div>
  );
}

// ── JSON / HTML controls ─────────────────────────────────────────────────────
function Controls({ setOutput }: { setOutput: (s: string) => void }) {
  const { query, actions } = useEditor();

  // Serialize the entire node tree → JSON
  // This is the `iqpages.json` we'd commit to chain alongside index.html
  function handleSave() {
    const json = query.serialize();
    localStorage.setItem('iqforge-craft-project', json);
    setOutput(JSON.stringify(JSON.parse(json), null, 2));
  }

  function handleLoad() {
    const saved = localStorage.getItem('iqforge-craft-project');
    if (!saved) { alert('Nothing saved yet.'); return; }
    actions.deserialize(saved);
  }

  // Craft.js doesn't have a built-in HTML exporter — we resolve the node tree
  // ourselves using renderToStaticMarkup. This is what goes into index.html on chain.
  function handleExport() {
    const json = query.serialize();
    const nodes = JSON.parse(json);
    // A full implementation would walk the node tree and render each component.
    // For this study, we show the structure so you can see what to walk.
    setOutput(
      '// Craft.js serialized node tree (walk this to render HTML):\n' +
      JSON.stringify(nodes, null, 2)
    );
    console.log('[Craft.js] Serialized nodes:', nodes);
    // Real export: render the <Frame> subtree with renderToStaticMarkup
    // (requires running React — typically done server-side or in a hidden iframe)
  }

  const btnStyle: React.CSSProperties = {
    padding: '6px 14px', border: 'none', borderRadius: 4, cursor: 'pointer',
    fontSize: 12, fontWeight: 600, marginRight: 8,
  };

  return (
    <div style={{ padding: '8px 12px', background: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, flex: 1 }}>Craft.js – IQForge Study</span>
      <button style={{ ...btnStyle, background: '#3b82f6', color: '#fff' }} onClick={handleSave}>Save JSON</button>
      <button style={{ ...btnStyle, background: '#6366f1', color: '#fff' }} onClick={handleLoad}>Load JSON</button>
      <button style={{ ...btnStyle, background: '#10b981', color: '#fff' }} onClick={handleExport}>Inspect Nodes</button>
    </div>
  );
}

// ── Root app ─────────────────────────────────────────────────────────────────
export function App() {
  const [output, setOutput] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Editor must wrap everything that calls useEditor() */}
      <Editor resolver={{ Text, Container, HeroBlock }}>
        <Controls setOutput={setOutput} />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Toolbox />

          {/* Canvas */}
          <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc', padding: 24 }}>
            <Frame>
              <Element is={Container} background="#f8fafc" padding={0} canvas>
                <HeroBlock />
                <Element is={Container} background="#ffffff" padding={24} canvas>
                  <Text text="Add blocks by dragging from the left panel." fontSize={16} color="#64748b" />
                </Element>
              </Element>
            </Frame>
          </div>

          {/* Settings */}
          <div style={{ width: 200, borderLeft: '1px solid #1e293b', background: '#0f172a', overflowY: 'auto' }}>
            <SettingsPanel />
          </div>
        </div>
      </Editor>

      {/* Output panel */}
      {output && (
        <div style={{
          maxHeight: 260, overflow: 'auto', background: '#0f172a', padding: 12,
          borderTop: '2px solid #3b82f6', fontFamily: 'monospace', fontSize: 12, color: '#94a3b8',
        }}>
          <button onClick={() => setOutput('')} style={{
            float: 'right', background: '#ef4444', color: '#fff', border: 'none',
            borderRadius: 4, padding: '2px 8px', cursor: 'pointer',
          }}>✕</button>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
