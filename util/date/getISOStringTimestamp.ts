import { unstable_cacheLife } from "next/cache";

export async function getISOStringTimestamp() {
  "use cache";
  unstable_cacheLife("seconds");
  return new Date().toISOString();
}
