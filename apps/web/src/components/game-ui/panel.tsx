import { cn } from "@/lib/utils";

export function GamePanel({
  className,
  glow,
  ...props
}: React.ComponentProps<"div"> & { glow?: boolean }) {
  return (
    <div
      className={cn(
        "game-panel text-white flex flex-col rounded-sm",
        glow && "game-glow",
        className
      )}
      {...props}
    />
  );
}

export function GamePanelHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-4 px-5 pt-5 pb-2",
        className
      )}
      {...props}
    />
  );
}

export function GamePanelTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-display font-bold text-xl tracking-wide text-[var(--game-accent)] game-text-glow",
        className
      )}
      {...props}
    />
  );
}

export function GamePanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5 flex flex-col gap-4", className)} {...props} />;
}
