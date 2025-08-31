"use client";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").slice(1);
  return (
    <div className="flex items-center gap-1">
      <Link href="/" className="text-blue-500 hover:underline">
        <Home />
      </Link>
      {paths.map((path, index) => {
        const isLastItem = index === paths.length - 1;
        if (isLastItem) {
          // 最後はスラッシュ不要でリンクにしない
          return <span key={path}>{path}</span>;
        }
        const pathname = paths.slice(0, index + 1).join("/");
        return (
          <Fragment key={path}>
            <Link
              href={`/${pathname}`}
              className="text-blue-500 hover:underline"
            >
              {path}
            </Link>
            <span>/</span>
          </Fragment>
        );
      })}
    </div>
  );
}
