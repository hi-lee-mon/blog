export async function ResolvePromise({
  children,
}: {
  children: Promise<React.ReactNode>;
}) {
  return await children;
}
