"use client";

import { Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GithubLink() {
  const url = "https://github.com/hi-lee-mon/blog/tree/main/app/(public)";
  const pathname = usePathname();
  return (
    <Button asChild variant="outline">
      <a href={`${url}${pathname}`} target="_blank" rel="noopener">
        <Github />
        コードを見る
      </a>
    </Button>
  );
}
