import { unstable_cacheLife } from "next/cache";
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
  // 以下でuse cache + revalidate指定でISRになる
  "use cache";
  unstable_cacheLife({
    revalidate: 5,
  });

  const image = await getImage();
  const timestamp = await getISOStringTimestamp();
  // const res = await fetch("https://dog.ceo/api/breeds/image/random", {
  //   next: { revalidate: 10 }, // 10秒ごとに再生成
  // });
  return (
    <div>
      ISR 5秒毎に再生成される: {timestamp}
      <Image src={image} alt="dog" width={300} height={300} />
    </div>
  );
};

// Dynamic IOをtrueにしたことでセグメントコンフィグはエラーになるためコメントアウト
// export const revalidate = 10; // 10秒ごとに再生成
export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImageComponent />
    </Suspense>
  );
}
