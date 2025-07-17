import { cn } from "@/lib/utils";

export default function Spacer({ className }: { className: string }) {
  return <div className={cn("w-full", className)} />;
}
