"use client";

import { createContext, useContext, useRef, useState } from "react";

type CursorMode = "default" | "view" | "hidden";

type CursorContextType = {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
  posRef: React.MutableRefObject<{ x: number; y: number }>;
};

const CursorContext = createContext<CursorContextType>({
  mode: "default",
  setMode: () => {},
  posRef: { current: { x: 0, y: 0 } },
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CursorMode>("default");
  const posRef = useRef({ x: 0, y: 0 });
  return (
    <CursorContext.Provider value={{ mode, setMode, posRef }}>
      {children}
    </CursorContext.Provider>
  );
}

export const useCursor = () => useContext(CursorContext);
