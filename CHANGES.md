# Gallery thumbnails round (quick one)

Browse Templates cards no longer show a giant initial letter. Each card now
renders the REAL template (its default content + theme) scaled to fit the
card, with a soft 1.5px blur and a gentle dark scrim for text legibility.

Why live renders instead of screenshot images: they can never go stale — the
gallery always shows exactly what opens in the editor, including any future
template edits, automatically. Renders are pointer-inert and aria-hidden, so
the whole card stays one clean click target.

Changed files: app/templates/page.tsx only.
Verified: tsc clean, next build clean.
