import { cn } from "@/lib/utils";

export function GameInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full h-10 px-3 rounded-md",
        "bg-black/40 border border-[#00ff00]/30 text-white placeholder:text-white/40",
        "font-display text-base tracking-wide",
        "outline-none focus:border-[#00ff00]/70 focus:ring-2 focus:ring-[#00ff00]/25",
        "transition-colors disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
