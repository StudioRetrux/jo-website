"use client";

import type { CSSProperties } from "react";
import styles from "./work.module.css";

type Phase = "closed" | "pre-open" | "open";

type Props = {
  phase: Phase;
  categories: string[];
  activeFilter: string;
  onFilterChange: (f: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (m: "grid" | "list") => void;
};

function reveal(phase: Phase): CSSProperties {
  return {
    transform: phase === "pre-open" ? "translateY(110%)" : "translateY(0)",
    transition: phase === "open"
      ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 150ms"
      : "none",
  };
}

export default function TitleArea({ phase, categories, activeFilter, onFilterChange, viewMode, onViewModeChange }: Props) {
  const filters = ["All", ...categories];

  return (
    <div className={styles.titleRevealClip}>
      <div className={styles.titleArea} style={reveal(phase)}>
        <div className={styles.titleAreaLeft}>
          <div className={styles.titleAreaContent}>
            <span className={styles.titleCaption}>Featured Projects</span>
            <h2 className={styles.titleHeading}>The Work</h2>
          </div>
        </div>
        <div className={styles.titleAreaRight}>
          <div className={styles.titleControls}>
            <div className={styles.titleBoxes}>
              <div className={styles.titleBox} onClick={() => onViewModeChange("grid")}>
                <img src="/Grid.png" className={styles.titleBoxIcon} alt="Grid view" style={{ opacity: viewMode === "grid" ? 1 : 0.6 }} />
              </div>
              <div className={styles.titleBox} onClick={() => onViewModeChange("list")}>
                <img src="/List.png" className={styles.titleBoxIcon} alt="List view" style={{ opacity: viewMode === "list" ? 1 : 0.6 }} />
              </div>
            </div>
            <div className={styles.titleFilters}>
              {filters.map((f) => (
                <span
                  key={f}
                  className={f === activeFilter ? styles.titleFilterActive : styles.titleFilter}
                  onClick={() => onFilterChange(f)}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
