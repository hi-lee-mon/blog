import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<Button asChild>
			<Link href="sandbox/mui/draggable-item">ドラッグ可能なアイテム</Link>
		</Button>
	);
}
