import React, { useState } from 'react';
import { Puck, Render, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';

// ── IQForge block definitions ────────────────────────────────────────────────
//
// Puck's model: a `config` object maps component names to:
//   { fields, defaultProps, render }
// The editor state is a plain `Data` object (serializable JSON).
// This is the cleanest integration point for IQForge.

const config: Config = {
  components: {

    // Hero Section block
    HeroSection: {
      fields: {
        title:    { type: 'text',  label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        scheme:   {
          type: 'select',
          label: 'Color scheme',
          options: [
            { value: 'dark',   label: 'Dark' },
            { value: 'light',  label: 'Light' },
            { value: 'accent', label: 'Accent' },
          ],
        },
      },
      defaultProps: {
        title: 'Hero Title',
        subtitle: 'Add a compelling subtitle here.',
        scheme: 'dark',
      },
      render: ({ title, subtitle, scheme }) => {
        const schemes: Record<string, React.CSSProperties> = {
          dark:   { background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: '#e2e8f0' },
          light:  { background: '#f8fafc', color: '#0f172a' },
          accent: { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' },
        };
        return (
          <section style={{ ...schemes[scheme], textAlign: 'center', padding: '60px 24px', borderRadius: 8 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 12 }}>{title}</h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>{subtitle}</p>
          </section>
        );
      },
    },

    // Text block
    TextBlock: {
      fields: {
        text:     { type: 'textarea', label: 'Content' },
        fontSize: { type: 'number',   label: 'Font size (px)' },
        align:    {
          type: 'select',
          label: 'Alignment',
          options: [
            { value: 'left',   label: 'Left'   },
            { value: 'center', label: 'Center' },
            { value: 'right',  label: 'Right'  },
          ],
        },
      },
      defaultProps: { text: 'Edit this text block.', fontSize: 16, align: 'left' },
      render: ({ text, fontSize, align }) => (
        <p style={{ fontSize, textAlign: align as React.CSSProperties['textAlign'], padding: '16px', lineHeight: 1.6 }}>
          {text}
        </p>
      ),
    },

    // Two-column layout
    TwoColumns: {
      fields: {
        leftContent:  { type: 'textarea', label: 'Left column'  },
        rightContent: { type: 'textarea', label: 'Right column' },
        gap:          { type: 'number',   label: 'Gap (px)'     },
      },
      defaultProps: {
        leftContent: 'Left column content',
        rightContent: 'Right column content',
        gap: 16,
      },
      render: ({ leftContent, rightContent, gap }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, padding: 16 }}>
          <div style={{ padding: 16, background: '#f1f5f9', borderRadius: 6 }}>{leftContent}</div>
          <div style={{ padding: 16, background: '#f1f5f9', borderRadius: 6 }}>{rightContent}</div>
        </div>
      ),
    },

    // Call to Action
    CTAButton: {
      fields: {
        heading: { type: 'text', label: 'Heading' },
        label:   { type: 'text', label: 'Button label' },
        href:    { type: 'text', label: 'Button URL'   },
        bg:      { type: 'text', label: 'Background color' },
      },
      defaultProps: {
        heading: 'Ready to go on-chain?',
        label: 'Publish now',
        href: '#',
        bg: '#eff6ff',
      },
      render: ({ heading, label, href, bg }) => (
        <div style={{ textAlign: 'center', padding: '40px 24px', background: bg, borderRadius: 8 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.5rem' }}>{heading}</h2>
          <a href={href} style={{
            display: 'inline-block', padding: '12px 28px', background: '#3b82f6',
            color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600,
          }}>
            {label}
          </a>
        </div>
      ),
    },
  },
};

// ── Initial page data ────────────────────────────────────────────────────────
//
// `Data` is the full editor state — serializable as JSON.
// This is what gets stored as `iqpages.json` on chain.

const initialData: Data = {
  content: [
    {
      type: 'HeroSection',
      props: { id: 'hero-1', title: 'My IQForge Site', subtitle: 'Built on Solana', scheme: 'dark' },
    },
    {
      type: 'TextBlock',
      props: { id: 'text-1', text: 'Drag blocks from the sidebar to build your page.', fontSize: 16, align: 'center' },
    },
  ],
  root: { props: {} },
  zones: {},
};

// ── Root app ─────────────────────────────────────────────────────────────────
export function App() {
  const [data, setData] = useState<Data>(initialData);
  const [mode, setMode] = useState<'edit' | 'preview' | 'json'>('edit');

  // This is the full IQForge publish flow:
  // 1. `data` is the JSON state → iqpages.json committed via git-sdk
  // 2. `<Render config={config} data={data} />` → renderToString → index.html committed via git-sdk
  function handlePublish(publishedData: Data) {
    setData(publishedData);
    localStorage.setItem('iqforge-puck-project', JSON.stringify(publishedData));
    console.log('[Puck] published data:', publishedData);
    alert('Saved locally. In IQForge: this data + rendered HTML would go to git-sdk commit.');
  }

  function handleLoad() {
    const saved = localStorage.getItem('iqforge-puck-project');
    if (!saved) { alert('Nothing saved yet — click Publish.'); return; }
    setData(JSON.parse(saved));
  }

  if (mode === 'preview') {
    return (
      <div>
        <div style={{ padding: '8px 12px', background: '#1a1a2e', display: 'flex', gap: 8 }}>
          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, flex: 1 }}>Puck – Preview</span>
          <button onClick={() => setMode('edit')} style={btnStyle('#3b82f6')}>← Edit</button>
          <button onClick={() => setMode('json')}  style={btnStyle('#6366f1')}>View JSON</button>
        </div>
        <Render config={config} data={data} />
      </div>
    );
  }

  if (mode === 'json') {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', padding: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setMode('edit')}    style={btnStyle('#3b82f6')}>← Edit</button>
          <button onClick={() => setMode('preview')} style={btnStyle('#10b981')}>Preview</button>
          <button onClick={handleLoad}               style={btnStyle('#6366f1')}>Load Saved</button>
        </div>
        <pre style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 12, overflowX: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', background: '#1a1a2e', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, flex: 1 }}>Puck – IQForge Study</span>
        <button onClick={() => setMode('preview')} style={btnStyle('#10b981')}>Preview</button>
        <button onClick={() => setMode('json')}    style={btnStyle('#6366f1')}>View JSON</button>
        <button onClick={handleLoad}               style={btnStyle('#8b5cf6')}>Load Saved</button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Puck
          config={config}
          data={data}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: '6px 14px', border: 'none', borderRadius: 4, cursor: 'pointer',
    fontSize: 12, fontWeight: 600, background: bg, color: '#fff',
  };
}
