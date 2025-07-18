"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").slice(1);
  return (
    <div>
      {paths.map((path, index) => {
        const pathname = paths.slice(0, index + 1).join("/");
        if (index === paths.length - 1) {
          // 最後はスラッシュ不要でリンクにしない
          return <span key={path}>{path}</span>;
        }
        return (
          <Link
            key={path}
            href={`/${pathname}`}
            className="text-blue-500 hover:underline"
          >
            {path}/
          </Link>
        );
      })}
    </div>
  );
}
