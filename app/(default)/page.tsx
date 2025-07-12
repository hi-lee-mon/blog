import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
	// 仮のダミーデータ
	const posts = [
		{
			slug: "first-post",
			title: "はじめての記事",
			summary: "これは最初のブログ記事です。",
		},
		{
			slug: "second-post",
			title: "2つ目の記事",
			summary: "2つ目の記事の概要です。",
		},
	];

	return (
		<main className="max-w-2xl mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6">My Blogへようこそ</h1>
			<p className="mb-8 text-lg">
				Next.jsとshadcn/uiで作成したサンプルブログです。
			</p>
			<h2 className="text-2xl font-semibold mb-4">最新記事</h2>
			<div className="space-y-4">
				{posts.map((post) => (
					<Card key={post.slug} className="p-4">
						<Link
							href={`/blog/${post.slug}`}
							className="text-xl font-semibold hover:underline"
						>
							{post.title}
						</Link>
						<p className="text-gray-500 mt-2">{post.summary}</p>
					</Card>
				))}
			</div>
		</main>
	);
}
