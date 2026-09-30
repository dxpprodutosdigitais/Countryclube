import type { ReactNode } from "react";

export type BadgeTone = "lagoa" | "accent" | "mata" | "areia" | "info" | "outline" | "dark" | "light";

export function Badge({ children, tone = "lagoa", size = "md", className }: { children: ReactNode; tone?: BadgeTone; size?: "sm" | "md"; className?: string }) {
  return <span className={["badge", `badge--${tone}`, size === "sm" ? "badge--sm" : "", className ?? ""].filter(Boolean).join(" ")}>{children}</span>;
}
