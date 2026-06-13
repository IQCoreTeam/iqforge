"use client";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(150 16% 6%)",
          border: "1px solid hsl(150 14% 14%)",
          color: "hsl(140 25% 92%)",
        },
      }}
    />
  );
}
