import Image from "next/image";
import { getISOStringTimestamp } from "@/util/date/getISOStringTimestamp";

export const dynamic = "force-dynamic"; //SSRを強制する
export default async function Page() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random", {
    cache: "no-store", // キャッシュを無効化=SSRを強制する
  });
  const data = await res.json();
  const image = data.message;
  const timestamp = getISOStringTimestamp();
  return (
    <div>
      SSR は毎回リロードされる: {timestamp}
      <Image src={image} alt="dog" width={300} height={300} />
    </div>
  );
}
