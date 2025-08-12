import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export async function getCurrentDirectoryFolders(importMetaUrl: string) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);

  // withFileTypes オプションでDirentオブジェクトを取得(型情報が付与されたオブジェクトが取得できるので後続の処理でフォルダを選別可能)
  const entries = await fs.readdir(__dirname, { withFileTypes: true });

  // ディレクトリのみをフィルタリングして名前を返す
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
