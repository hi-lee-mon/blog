import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full border-b">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-xl">
          Shun's Blog
        </Link>
        <div className="space-x-4">
          <Button asChild variant="link">
            <Link href="/sandbox">遊び場</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
