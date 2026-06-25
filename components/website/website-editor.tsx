// components/website/website-editor.tsx
//
// Thin wrapper around the Puck editor for the IQForge Website path. Kept in its
// own module so the page can load it with next/dynamic({ ssr: false }) — Puck is
// a browser-only editor and must not run during server rendering.

"use client";

import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { iqPuckConfig } from "@/lib/puck-config";

export function WebsiteEditor({
  data,
  onPublish,
}: {
  data: Data;
  onPublish: (data: Data) => void;
}) {
  return (
    <div style={{ height: "calc(100vh - 56px)" }}>
      <Puck config={iqPuckConfig} data={data} onPublish={onPublish} />
    </div>
  );
}
