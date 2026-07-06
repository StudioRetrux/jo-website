"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type SectionContextType = {
  section: string;
  navigate: (path: string) => void;
};

const SectionContext = createContext<SectionContextType>({
  section: "/",
  navigate: () => {},
});

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [section, setSection] = useState("/");

  useEffect(() => {
    setSection(window.location.pathname);

    function onPopState() {
      setSection(window.location.pathname);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    setSection(path);
  }, []);

  return (
    <SectionContext.Provider value={{ section, navigate }}>
      {children}
    </SectionContext.Provider>
  );
}

export const useSection = () => useContext(SectionContext);
