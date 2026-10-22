"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { ReactNode, useEffect } from "react";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.1,       
      smoothWheel: true,
      anchors: true,    
      autoRaf: true,
    });
    
    const onLoad = () => lenis.resize();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}