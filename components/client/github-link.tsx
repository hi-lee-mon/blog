"use client";

import { Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GithubLink() {
	const url = "https://github.com/hi-lee-mon/blog/tree/main";
	const pathname = usePathname();
	return (
		<Button asChild size="icon" variant="outline">
			<a href={`${url}${pathname}`} target="_blank" rel="noopener">
				<Github />
			</a>
		</Button>
	);
}
