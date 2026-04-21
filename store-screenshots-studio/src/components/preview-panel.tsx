"use client";

import { useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/data/design-tokens";

type PreviewPanelProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function PreviewPanel({
  title,
  subtitle,
  children,
}: PreviewPanelProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const node = frameRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextScale = entry.contentRect.width / CANVAS_WIDTH;
      setScale(nextScale);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <article
      className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_72px_rgba(0,0,0,0.24)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="m-0 font-heading text-2xl font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-1 mb-0 max-w-xl text-sm leading-6 text-slate-400">
            {subtitle}
          </p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
          Preview
        </span>
      </div>
      <div className="overflow-hidden rounded-[22px] border border-white/8 bg-black/40">
        <div
          ref={frameRef}
          style={{
            height: CANVAS_HEIGHT * scale,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              left: 0,
              position: "absolute",
              top: 0,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
