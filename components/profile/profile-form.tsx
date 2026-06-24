"use client";

import type { ProfileData, ProfileLink } from "@/lib/profile";

export function ProfileForm({
  data,
  onChange,
}: {
  data: ProfileData;
  onChange: (data: ProfileData) => void;
}) {
  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    onChange({ ...data, [key]: value });

  const setLink = (index: number, link: ProfileLink) => {
    const next = [...data.links];
    next[index] = link;
    set("links", next);
  };

  const addLink = () => set("links", [...data.links, { label: "", url: "https://" }]);

  const removeLink = (index: number) =>
    set("links", data.links.filter((_, i) => i !== index));

  return (
    <div className="space-y-5">
      <Field label="Display name">
        <input
          value={data.displayName}
          onChange={(e) => set("displayName", e.target.value)}
          maxLength={40}
          placeholder="Satoshi"
          className={INPUT_CLS}
        />
      </Field>

      <Field label="Handle">
        <input
          value={data.handle}
          onChange={(e) => set("handle", e.target.value)}
          maxLength={30}
          placeholder="@satoshi"
          className={INPUT_CLS}
        />
      </Field>

      <Field label="Bio">
        <textarea
          value={data.bio}
          onChange={(e) => set("bio", e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="A short line about who you are."
          className={INPUT_CLS + " resize-none"}
        />
      </Field>

      <Field label="Avatar URL" hint="Paste a URL or leave blank">
        <input
          value={data.avatar ?? ""}
          onChange={(e) => set("avatar", e.target.value)}
          placeholder="https://..."
          className={INPUT_CLS}
        />
      </Field>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">Links</label>
          <button
            onClick={addLink}
            className="text-xs font-medium text-primary hover:underline"
          >
            + Add link
          </button>
        </div>
        <div className="space-y-2">
          {data.links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={link.label}
                onChange={(e) => setLink(i, { ...link, label: e.target.value })}
                placeholder="Label"
                className={INPUT_CLS + " w-1/3"}
              />
              <input
                value={link.url}
                onChange={(e) => setLink(i, { ...link, url: e.target.value })}
                placeholder="https://"
                className={INPUT_CLS + " flex-1"}
              />
              <button
                onClick={() => removeLink(i)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove link"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {label}
        {hint && <span className="ml-2 font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary";
