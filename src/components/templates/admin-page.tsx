import { cn } from "@/lib/utils";

export function AdminPageTemplate({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 relative z-10">
      <div className="p-2 md:p-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex flex-col gap-6 flex-1 w-full h-full shadow-md rounded-l-3xl">
        <div className="flex justify-between items-center">
          <h1
            className={cn(
              "inline-block animate-appear opacity-0",
              "bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground",
              "bg-clip-text text-transparent",
              "text-2xl md:text-3xl font-bold tracking-tight",
              "leading-[1.1]",
              "drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            )}
          >
            {title}
          </h1>
          {actions && <div className="flex justify-end">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
