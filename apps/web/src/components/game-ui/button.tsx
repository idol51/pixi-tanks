import { cn } from "@/lib/utils";

type GameButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<GameButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[#22dd44] to-[#00aa22] text-[#0a120a] font-bold border border-[#00ff00]/60 hover:from-[#33ee55] hover:to-[#00cc33] game-glow",
  secondary:
    "bg-black/50 text-white border border-[#00ff00]/40 hover:bg-[#00ff00]/10 hover:border-[#00ff00]/70",
  ghost:
    "bg-transparent text-white/80 border border-transparent hover:bg-white/10 hover:text-white",
  danger:
    "bg-gradient-to-b from-[#ff5555] to-[#cc2222] text-white font-bold border border-[#ff4444]/60 hover:from-[#ff6666] hover:to-[#dd3333]",
};

const sizeStyles = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3 py-1 text-xs",
  lg: "h-12 px-6 py-3 text-base",
  icon: "h-10 w-10 p-0",
};

export function GameButton({
  className,
  variant = "primary",
  size = "default",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: GameButtonVariant;
  size?: keyof typeof sizeStyles;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
