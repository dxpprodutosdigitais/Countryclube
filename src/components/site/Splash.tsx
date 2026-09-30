"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/** Splash navy com logo pulsando até a app montar; fade-out 400ms. */
export function Splash() {
  const [gone, setGone] = useState(false);
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 150);
    const t2 = setTimeout(() => setGone(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (gone) return null;
  return (
    <div className={["cc-splash", out ? "is-out" : ""].join(" ")} aria-hidden>
      <img src={SITE.logo} alt="" />
      <div className="cc-splash-title">Country Clube de Formiga</div>
      <div className="cc-splash-dots"><span /><span /><span /></div>
    </div>
  );
}
