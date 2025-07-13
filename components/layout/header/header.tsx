import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full border-b mb-8">
			<nav className="max-w-2xl mx-auto flex items-center justify-between py-4 px-4">
				<Link href="/" className="text-xl font-bold">
					Shun's Blog
				</Link>
				<div className="space-x-4">
					<Button asChild variant="link">
						<Link href="/sandbox">遊び場</Link>
					</Button>
				</div>
			</nav>
		</header>
	);
}
