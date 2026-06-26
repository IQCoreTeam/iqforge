"use client";

import { SOCIAL_PLATFORMS, type ProfileData } from "@/lib/profile";

export function ProfileForm({
  data,
  onChange,
}: {
  data: ProfileData;
  onChange: (data: ProfileData) => void;
}) {
  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    onChange({ ...data, [key]: value });

  const setSocial = (key: string, value: string) => {
    const next = { ...data.socials };
    if (value.trim()) next[key as keyof typeof next] = value;
    else delete next[key as keyof typeof next];
    set("socials", next);
  };

  return (
    <div className="space-y-5">
      <Field label="Name">
        <input
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          maxLength={40}
          placeholder="Satoshi"
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

      <Field label="Profile picture" hint="Paste a URL or leave blank">
        <input
          value={data.profilePicture ?? ""}
          onChange={(e) => set("profilePicture", e.target.value)}
          placeholder="https://..."
          className={INPUT_CLS}
        />
      </Field>

      <div>
        <label className="mb-2 block text-sm font-medium">Socials</label>
        <div className="space-y-2">
          {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
              <input
                value={data.socials[key] ?? ""}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={placeholder}
                className={INPUT_CLS + " flex-1"}
              />
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
