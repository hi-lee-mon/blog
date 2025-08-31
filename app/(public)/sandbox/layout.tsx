import GithubLink from "@/components/client/github-link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-bold">あそびば</h1>
        <GithubLink />
      </div>
      {children}
    </div>
  );
}
