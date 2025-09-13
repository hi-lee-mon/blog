"use client";
import { Link2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/sandbox/tips/active-link/1",
    label: "1 Link",
  },
  { href: "/sandbox/tips/active-link/2", label: "2 Link" },
  { href: "/sandbox/tips/active-link/3", label: "3 Link" },
] as const;

export default function Layout({
  children,
}: LayoutProps<"/sandbox/tips/active-link">) {
  return (
    <div>
      <header className="mb-4 flex gap-4">
        {links.map(({ href, label }) => (
          <ActiveLink
            key={href}
            href={href}
            className="flex gap-1 text-muted-foreground"
            activeClassName="font-bold underline text-foreground"
          >
            {label}
            <Link2Icon
              size="24"
              className="group-aria-[current=true]:text-blue-500" // 子にはgroupを指定することで親の状態によってスタイルを切り替える
            />
          </ActiveLink>
        ))}
      </header>
      {children}
    </div>
  );
}

type ActiveLinkProps = React.ComponentProps<typeof Link> & {
  activeClassName?: string;
};

function ActiveLink({
  className,
  href,
  activeClassName,
  ...props
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      {...props}
      href={href}
      aria-current={isActive}
      className={cn("group", className, isActive && activeClassName)} // cnはactiveClassNameを優先する
    />
  );
}
