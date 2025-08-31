import Image from "next/image";
import { Suspense } from "react";
import { getISOStringTimestamp } from "@/util/date/getISOStringTimestamp";

const getImage = async () => {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  const image = data.message;
  return image;
};

const ImageComponent = async () => {
  // use cacheを宣言しなければSSRとなる
  return (
    <div>
      SSR は毎回リロードされる: {await getISOStringTimestamp()}
      <Image src={await getImage()} alt="dog" width={300} height={300} />
    </div>
  );
};

// Dynamic IOをtrueにしたことでセグメントコンフィグはエラーになるためコメントアウト
// export const dynamic = "force-dynamic"; //SSRを強制する
export default async function Page() {
  // const data = fetch("https://dog.ceo/api/breeds/image/random", {
  //   cache: "no-store", // キャッシュを無効化=SSRを強制する
  // });

  // ⭐️use cacheを宣言しなければSSRとなる。use cacheを使用しない場合はsuspenseでラップする必要がある
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImageComponent />
    </Suspense>
  );
}
