import { ComponentProps } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "h-17 border-2 border-accent bg-dark text-background hover:bg-button-primary-hover active:bg-button-primary-active",
  secondary:
    "h-16 border border-decore bg-pure text-foreground hover:border-2 hover:border-accent hover:bg-button-secondary-hover active:bg-button-secondary-active",
};

export function DefaultButton({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "w-full rounded-xs font-sans text-sm font-semibold tracking-button disabled:opacity-30",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
