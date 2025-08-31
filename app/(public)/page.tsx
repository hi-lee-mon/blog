import { ResolvePromise } from "@/components/shared/resolve-promise";
import PostLinkCard from "./blog/_components/post-link-card";
import { getPosts } from "./blog/action";

export default async function Home() {
  const postsPromise = getPosts();
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ResolvePromise>
        {postsPromise.then((posts) => {
          return posts.map((post) => (
            <PostLinkCard key={post.id} post={post} />
          ));
        })}
      </ResolvePromise>
    </div>
  );
}
