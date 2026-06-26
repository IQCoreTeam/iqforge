import { useNode } from '@craftjs/core';

type TextProps = {
  text?: string;
  fontSize?: number;
  color?: string;
};

export function Text({ text = 'Edit this text', fontSize = 16, color = '#1e293b' }: TextProps) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <p
      ref={ref => connect(drag(ref!))}
      style={{ fontSize, color, padding: '8px', lineHeight: 1.6, cursor: 'move' }}
    >
      {text}
    </p>
  );
}

// craft metadata — tells Craft.js how to render this component in the settings panel
Text.craft = {
  displayName: 'Text',
  props: { text: 'Edit this text', fontSize: 16, color: '#1e293b' },
  related: {
    // Settings panel (simplified — a full app would render form controls here)
    settings: () => <div style={{ padding: 8, fontSize: 12, color: '#94a3b8' }}>Text settings</div>,
  },
};
