import Link from "next/link";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full border-b">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-xl">
          Shun's Blog
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="link">
            <Link href="/sandbox">遊び場</Link>
          </Button>
          <span className="flex-1"></span>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
