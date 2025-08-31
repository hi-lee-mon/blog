import Link from "next/link";
import { Card } from "@/components/ui/card";

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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-bold text-3xl">Shun's Blogへようこそ</h1>
      <p className="mb-8 text-lg">Next.jsとshadcn/uiで作成したブログです。</p>
      <h2 className="mb-4 font-semibold text-2xl">最新記事</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.slug} className="p-4">
            <Link
              href={`/blog/${post.slug}`}
              className="font-semibold text-xl hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-2 text-gray-500">{post.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
