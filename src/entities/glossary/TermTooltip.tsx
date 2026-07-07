"use client";

import { useTranslations } from "next-intl";
import { Tooltip } from "@/shared/ui/tooltip";

type TermKey = "pool" | "stack" | "gift" | "distortion" | "run";

interface TermTooltipProps {
  term: TermKey;
  children?: React.ReactNode;
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const t = useTranslations("GameTerms");

  return <Tooltip content={t(`${term}.description`)}>{children ?? t(`${term}.label`)}</Tooltip>;
}
