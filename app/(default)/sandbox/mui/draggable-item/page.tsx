"use client";
import dynamic from "next/dynamic";

// windowオブジェクトがないとエラーが出るため、ssr: false を設定
const DraggableItem = dynamic(() => import("./draggable-item"), {
	ssr: false,
});

export default function Page() {
	return <DraggableItem />;
}
