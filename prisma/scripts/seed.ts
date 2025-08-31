import { PrismaClient } from "../../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // クリーンアップ
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.postTag.deleteMany();

  // 方法1: 個別作成で作成されたレコードを取得
  const nextjsTag = await prisma.tag.create({
    data: { name: "Next.js", slug: "nextjs", description: "Next.jsのタグ" },
  });

  const reactTag = await prisma.tag.create({
    data: { name: "React", slug: "react", description: "Reactのタグ" },
  });

  const typescriptTag = await prisma.tag.create({
    data: {
      name: "TypeScript",
      slug: "typescript",
      description: "TypeScriptのタグ",
    },
  });

  const post1 = await prisma.post.create({
    data: {
      title: "はじめてのブログ投稿",
      content:
        "これは最初のブログ投稿です。Next.jsとPrismaでブログを作成しています。",
      topImage: "https://picsum.photos/seed/post1/600/400",
      published: true,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "2番目のブログ投稿",
      content:
        "これは2番目のブログ投稿です。Next.jsとPrismaでブログを作成しています。",
      topImage: "https://picsum.photos/seed/post2/600/400",
      published: true,
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: nextjsTag.id },
      { postId: post1.id, tagId: reactTag.id },
      { postId: post2.id, tagId: nextjsTag.id },
      { postId: post2.id, tagId: typescriptTag.id },
    ],
  });

  // 結果確認
  console.log("シードデータの作成が完了しました");
  console.log("作成されたタグ:", { nextjsTag, reactTag, typescriptTag });
  console.log("作成された投稿:", { post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
