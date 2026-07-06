import { useEffect, useRef } from "react";

const SLIDE_MS = 600;
const SLIDE_START_MS = 500;
const EASE = "cubic-bezier(0.37, 0, 0.63, 1)";

export default function WorkSpacer({
  height,
  collapsed = false,
}: {
  height: string | number;
  collapsed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const el = ref.current;
    if (!el) return;
    if (collapsed) {
      t = setTimeout(() => {
        el.style.height = `${el.offsetHeight}px`;
        requestAnimationFrame(() => {
          el.style.transition = `height ${SLIDE_MS}ms ${EASE}`;
          el.style.height = "0px";
        });
      }, SLIDE_START_MS);
    } else {
      const targetHeight = typeof height === "number" ? `${height}px` : height;
      if (el.style.height === "0px") {
        // re-entry: animate expand
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = `height ${SLIDE_MS}ms ${EASE}`;
            el.style.height = targetHeight;
          });
        });
        t = setTimeout(() => { el.style.transition = ""; }, SLIDE_MS + 50);
      } else {
        el.style.height = targetHeight;
        el.style.transition = "";
      }
    }
    return () => clearTimeout(t);
  }, [collapsed, height]);

  return (
    <div ref={ref} style={{ width: "100%", height }} />
  );
}
