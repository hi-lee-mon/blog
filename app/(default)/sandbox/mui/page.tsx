import { Button } from "@mui/material";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Button component={Link} href="/sandbox/mui/draggable-item">
        ドラッグ可能なアイテム
      </Button>
      <Button component={Link} href="/sandbox/mui/resizable-item">
        リサイズ可能なアイテム
      </Button>
      <Button component={Link} href="/sandbox/mui/draggable-resizable-dialog">
        ドラッグ＆リサイズ可能なダイアログ
      </Button>
      <Button component={Link} href="/sandbox/mui/grid">
        Grid
      </Button>
    </div>
  );
}
