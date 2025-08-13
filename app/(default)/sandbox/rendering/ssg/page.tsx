import Image from "next/image";
import { getISOStringTimestamp } from "@/util/date/getISOStringTimestamp";

export default async function Page() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random"); // 単なるfetchの場合はSSGとして扱われる
  const data = await res.json();
  const image = data.message;
  const timestamp = getISOStringTimestamp();
  return (
    <div>
      SSG
      ビルド時に固定されるのでリロードしても変わらない。変更するには再ビルドが必要:{" "}
      {timestamp}
      <Image src={image} alt="dog" width={300} height={300} />
    </div>
  );
}
