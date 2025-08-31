import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PostWithTags } from "../action";

export default function PostLinkCard({ post }: { post: PostWithTags }) {
  return (
    <div className="container py-4 transition-shadow duration-300 hover:opacity-90">
      <div className="relative rounded-md border p-8 shadow">
        <div className="relative aspect-video">
          <Image
            src={post.topImage ?? ""}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <h2>
            <Link href={`/blog/${post.id}`} className="text-3xl">
              {post.title}
              <span className="absolute inset-0"></span>
            </Link>
          </h2>
          <p className="line-clamp-3">{post.content}</p>
          <div className="flex gap-4">
            {post.tags.map((postTag) => (
              <Button
                variant="outline"
                className="z-10"
                asChild
                key={postTag.id}
              >
                <Link href={`/blog/tag/${postTag.tag.slug}`}>
                  {postTag.tag.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
