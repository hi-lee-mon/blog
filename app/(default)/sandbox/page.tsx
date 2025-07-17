import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="space-y-4">
      <Button asChild>
        <Link href="sandbox/mui/draggable-item">ドラッグ可能なアイテム</Link>
      </Button>
      <Button asChild>
        <Link href="sandbox/mui/resizable-item">リサイズ可能なアイテム</Link>
      </Button>
      <Button asChild>
        <Link href="sandbox/mui/draggable-resizable-dialog">
          ドラッグ＆リサイズ可能なダイアログ
        </Link>
      </Button>
      <Button asChild>
        <Link href="sandbox/mui/grid">Grid</Link>
      </Button>
    </div>
  );
}
