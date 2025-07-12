import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full border-b mb-8">
			<nav className="max-w-2xl mx-auto flex items-center justify-between py-4 px-4">
				<Link href="/" className="text-xl font-bold">
					My Blog
				</Link>
				<div className="space-x-4">
					<Link href="/blog" className="hover:underline">
						ブログ
					</Link>
					<Link href="/about" className="hover:underline">
						このサイトについて
					</Link>
				</div>
			</nav>
		</header>
	);
}
