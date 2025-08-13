import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div>
      404
      <Button asChild>
        <Link href="/">ホームへ移動する</Link>
      </Button>
    </div>
  );
}
