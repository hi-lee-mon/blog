import GithubLink from "@/components/client/github-link";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">あそびば</h1>
				<GithubLink />
			</div>
			{children}
		</div>
	);
}
