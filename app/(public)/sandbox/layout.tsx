import GithubLink from "@/components/client/github-link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto px-4 py-16">
      <div className="mb-16 flex items-center justify-between">
        <h1 className="font-bold text-3xl">あそびば</h1>
        <GithubLink />
      </div>
      {children}
    </div>
  );
}
