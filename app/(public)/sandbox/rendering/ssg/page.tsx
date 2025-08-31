import {
  revalidateTag,
  unstable_cacheLife,
  unstable_cacheTag,
} from "next/cache";
import Image from "next/image";
import { getISOStringTimestamp } from "@/util/date/getISOStringTimestamp";

const getImage = async () => {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  const image = data.message;
  return image;
};

const ImageComponent = async () => {
  // use cache + max指定でSSGになる（静的レンダリングなのでsuspenseでラップする必要がない）
  "use cache";
  unstable_cacheLife("max");
  // tagを指定することでrevalidateTagで再生成可能（tagを使わない場合はre-buildが必要）
  unstable_cacheTag("dog-image");

  const image = await getImage();
  const timestamp = await getISOStringTimestamp();
  return (
    <div className="flex flex-col gap-4">
      SSG
      ビルド時に固定されるのでリロードしても変わらない。変更するには再ビルド、もしくはrevalidateTagが必要:{" "}
      {timestamp}
      <Image src={image} alt="dog" width={300} height={300} />
      <form
        action={async () => {
          "use server";
          revalidateTag("dog-image");
        }}
      >
        <button
          className="rounded-md border-2 p-2 transition-shadow hover:shadow-md"
          type="submit"
        >
          再生成(revalidateTag)
        </button>
      </form>
    </div>
  );
};

export default async function Page() {
  return <ImageComponent />;
}
