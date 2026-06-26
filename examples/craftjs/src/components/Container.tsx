import { useNode, useEditor, Element } from '@craftjs/core';
import { Text } from './Text';

type ContainerProps = {
  background?: string;
  padding?: number;
  children?: React.ReactNode;
};

export function Container({ background = '#f8fafc', padding = 24, children }: ContainerProps) {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={ref => connect(drag(ref!))}
      style={{ background, padding, minHeight: 80, borderRadius: 8, cursor: 'move', border: '1px dashed #cbd5e1' }}
    >
      {children}
    </div>
  );
}

Container.craft = {
  displayName: 'Container',
  props: { background: '#f8fafc', padding: 24 },
  rules: {
    canDrop: () => true, // accept any child
  },
};

// A pre-composed "hero" block that ships as a draggable block in the toolbox.
// This is the Craft.js pattern for IQForge blocks: a Container + children baked in.
export function HeroBlock() {
  return (
    <Element is={Container} background="linear-gradient(135deg,#1a1a2e,#16213e)" padding={60} canvas>
      <Text text="Hero Title" fontSize={36} color="#e2e8f0" />
      <Text text="Subtitle text" fontSize={18} color="#94a3b8" />
    </Element>
  );
}

HeroBlock.craft = {
  displayName: 'Hero Section',
  related: {
    settings: () => <div style={{ padding: 8, fontSize: 12, color: '#94a3b8' }}>Hero settings</div>,
  },
};
