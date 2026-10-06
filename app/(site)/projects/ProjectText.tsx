"use client";

import SplitReveal from "../SplitReveal";
import type { ComponentProps } from "react";

/** The hero's masked line reveal, played once as detail-page copy scrolls in. */
export default function ProjectText(props: Omit<ComponentProps<typeof SplitReveal>, "scroll" | "play">) {
  return <SplitReveal {...props} play scroll />;
}
