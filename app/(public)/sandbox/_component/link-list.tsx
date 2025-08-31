import Link from "next/link";
import path from "path";
import { fileURLToPath } from "url";
import { Button } from "@/components/ui/button";
import { getCurrentDirectoryFolders } from "@/util/file/getCurrentDirectoryFolders";

type Props = {
  importMetaUrl: string;
};

export default async function LinkList({ importMetaUrl }: Props) {
  const __filename = fileURLToPath(importMetaUrl);
  const currentFolder = path.dirname(__filename).split("/").at(-1);
  const folders = await getCurrentDirectoryFolders(importMetaUrl);
  // プライベートフォルダは除外
  const filteredFolders = folders.filter((folder) => !folder.match(/^_.*$/));

  return (
    <div className="flex gap-2">
      {filteredFolders.map((folder) => (
        <Button asChild key={folder}>
          <Link href={`${currentFolder}/${folder}`}>{folder}</Link>
        </Button>
      ))}
    </div>
  );
}
