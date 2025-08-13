import { notFound } from "next/navigation";

// 仮のダミーデータ
const posts = [
  {
    slug: "first-post",
    title: "はじめての記事",
    content: "これは最初のブログ記事の本文です。",
  },
  {
    slug: "second-post",
    title: "2つ目の記事",
    content: "2つ目の記事の本文です。",
  },
];

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <article className="prose prose-neutral dark:prose-invert">
        {post.content}
      </article>
    </main>
  );
}
