import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function HStack({
  children,
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("flex", className)} {...props}>
      {children}
    </div>
  );
}
