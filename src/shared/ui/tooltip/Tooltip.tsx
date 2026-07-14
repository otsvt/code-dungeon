"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  triggerClassName?: string;
}

type TooltipPosition = {
  top: number;
  left: number;
  arrowLeft: number;
  placement: "top" | "bottom";
};

const DEFAULT_TRIGGER_CLASS_NAME =
  "cursor-help font-semibold text-decore underline decoration-dotted underline-offset-4 decoration-decore/80 transition hover:text-accent";

const TOOLTIP_GAP = 8;
const VIEWPORT_PADDING = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function Tooltip({ children, content, triggerClassName = DEFAULT_TRIGGER_CLASS_NAME }: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  const isOpen = isHovered || isFocused;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;

    if (!trigger || !tooltip) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const spaceAbove = triggerRect.top - VIEWPORT_PADDING;
    const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING;
    const requiredSpace = tooltipRect.height + TOOLTIP_GAP;

    const placement = spaceAbove >= requiredSpace || spaceAbove >= spaceBelow ? "top" : "bottom";

    const preferredTop =
      placement === "top" ? triggerRect.top - tooltipRect.height - TOOLTIP_GAP : triggerRect.bottom + TOOLTIP_GAP;

    const top = clamp(preferredTop, VIEWPORT_PADDING, window.innerHeight - tooltipRect.height - VIEWPORT_PADDING);
    const left = clamp(
      triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      VIEWPORT_PADDING,
      window.innerWidth - tooltipRect.width - VIEWPORT_PADDING,
    );
    const arrowLeft = clamp(
      triggerRect.left + triggerRect.width / 2 - left,
      VIEWPORT_PADDING,
      tooltipRect.width - VIEWPORT_PADDING,
    );

    setPosition({ top, left, arrowLeft, placement });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    const resizeObserver = new ResizeObserver(updatePosition);

    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    if (tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return (
    <span className="inline-flex">
      <span
        ref={triggerRef}
        className={triggerClassName}
        tabIndex={0}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);

          if (!isFocused) {
            setPosition(null);
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);

          if (!isHovered) {
            setPosition(null);
          }
        }}
      >
        {children}
      </span>
      {isOpen &&
        createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none fixed z-50 w-60 max-w-[calc(100vw-1rem)] rounded-md border border-decore bg-dark px-3 py-2 text-center text-sm text-accent shadow-lg"
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? "visible" : "hidden",
            }}
          >
            {content}
            <span
              className={`absolute h-2 w-2 -translate-x-1/2 rotate-45 bg-dark ${
                position?.placement === "bottom"
                  ? "bottom-full translate-y-1/2 border-l border-t border-decore"
                  : "top-full -translate-y-1/2 border-b border-r border-decore"
              }`}
              style={{ left: position?.arrowLeft ?? "50%" }}
            />
          </span>,
          document.body,
        )}
    </span>
  );
}
