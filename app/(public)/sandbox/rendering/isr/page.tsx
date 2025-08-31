import Image from "next/image";
import { getISOStringTimestamp } from "@/util/date/getISOStringTimestamp";

export const revalidate = 10; // 10秒ごとに再生成
export default async function Page() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random", {
    next: { revalidate: 10 }, // 10秒ごとに再生成
  });
  const data = await res.json();
  const image = data.message;
  const timestamp = getISOStringTimestamp();
  return (
    <div>
      ISR 10秒毎に再生成される: {timestamp}
      <Image src={image} alt="dog" width={300} height={300} />
    </div>
  );
}
