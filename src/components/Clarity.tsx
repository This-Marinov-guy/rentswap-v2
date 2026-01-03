"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export default function Clarity() {
  useEffect(() => {
    // Always disable in development
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // Check if Clarity is enabled via environment variable
    const clarityEnabled = process.env.NEXT_PUBLIC_CLARITY_ENABLED == "1";
    const clarityToken = process.env.NEXT_PUBLIC_CLARITY_TOKEN;

    if (!clarityEnabled || !clarityToken) {
      return;
    }

    // Load Microsoft Clarity script
    if (typeof window !== "undefined") {
      (function (c: Window, l: Document, a: string, r: string, i: string) {
        const clarity = c as any;
        clarity[a] =
          clarity[a] ||
          function () {
            (clarity[a].q = clarity[a].q || []).push(arguments);
          };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0];
        if (y && y.parentNode) {
          y.parentNode.insertBefore(t, y);
        }
      })(window, document, "clarity", "script", clarityToken);
    }
  }, []);

  return null;
}

