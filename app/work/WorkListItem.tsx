import type { CSSProperties } from "react";
import { useState } from "react";
import ItemMenuText from "./ItemMenuText";
import styles from "./work.module.css";

type Props = {
  title?: string;
  category?: string;
  year?: number;
  filtered?: boolean;
  dimmed?: boolean;
  onEl?: (el: HTMLDivElement | null) => void;
  enterDelay?: number;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

const LIST_FILTER_MS = 600;
const LIST_FILTER_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export default function WorkListItem({ title = "Project Title", category, year, filtered = false, dimmed = false, onEl, enterDelay = 0, onHoverIn, onHoverOut }: Props) {
  const [bgClipPath, setBgClipPath] = useState("inset(0 100% 0 0)");

  const info = [category, year].filter(Boolean).join(" • ");

  return (
    <div
      className={styles.workListItem}
      data-work-list-item={filtered ? undefined : ""}
      ref={onEl}
      style={{
        animation: `listItemEnter 500ms cubic-bezier(0.37, 0, 0.63, 1) ${enterDelay}ms both`,
        height: filtered ? "0px" : undefined,
        borderColor: filtered ? "transparent" : undefined,
        borderBottomWidth: filtered ? "0px" : undefined,
        "--work-list-item-content-opacity": dimmed ? 0.6 : 1,
        "--work-list-filter-duration": `${LIST_FILTER_MS}ms`,
        "--work-list-filter-ease": LIST_FILTER_EASE,
      } as CSSProperties}
      onMouseEnter={() => {
        onHoverIn?.();
        setBgClipPath("inset(0 0 0 0)");
      }}
      onMouseLeave={() => {
        onHoverOut?.();
        setBgClipPath("inset(0 100% 0 0)");
      }}
    >
      <div
        className={styles.workListItemInner}
        style={{
          transform: filtered ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <span
          className={styles.workListItemBg}
          aria-hidden="true"
          style={{
            clipPath: bgClipPath,
          }}
        />
        <ItemMenuText text={title} />
        <span className={styles.workListInfo}>{info}</span>
      </div>
    </div>
  );
}
