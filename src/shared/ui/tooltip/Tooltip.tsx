interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      <span className="cursor-help font-semibold text-decore underline  decoration-dotted underline-offset-4 decoration-decore/80 transition hover:text-accent">
        {children}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 w-60 mb-2 px-3 py-2 rounded-md border border-decore bg-dark text-sm text-center text-accent opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100">
        {content}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-decore bg-dark" />
      </span>
    </span>
  );
}
