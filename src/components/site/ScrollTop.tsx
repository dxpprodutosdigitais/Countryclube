"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Scroll ao topo a cada navegação (exceto quando há âncora na URL). */
export function ScrollTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) { el.scrollIntoView({ block: "start" }); return; }
    }
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}
