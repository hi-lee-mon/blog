"use server";
import "server-only";

import { revalidateTag, unstable_cacheTag } from "next/cache";
import { cache } from "react";
import type { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

/**
 * 投稿データを取得
 */
// Prismaの型生成を使用して戻り値の型を定義
export type PostWithTags = Prisma.PostGetPayload<{
  include: {
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;
const getPostsCacheKey = "getPosts";
export const getPosts = cache(async (): Promise<PostWithTags[]> => {
  "use cache";
  unstable_cacheTag(getPostsCacheKey);
  const posts = await prisma.post.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return posts;
});
export const revalidateGetPosts = async () => revalidateTag(getPostsCacheKey);
