import type { LinkProps } from "next/link";
import Link from "next/link";
import { useState } from "react";

export default function HoverPrefetchLink(props: LinkProps) {
	const [active, setActive] = useState(false);
	return (
		<Link
			{...props}
			prefetch={active ? null : false}
			onMouseEnter={() => setActive(true)}
		/>
	);
}
