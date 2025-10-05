import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function VStack({
  children,
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}
