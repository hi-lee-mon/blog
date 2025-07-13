export default function Footer() {
	return (
		//  footerを画面下部に配置する場合、親要素のクラスに依存する。左記のクラスを親に設定すること。className="min-h-dvh flex flex-col"
		<footer className="w-full border-t mt-8 py-4 text-center text-sm text-gray-500 sticky top-full">
			&copy; {new Date().getFullYear()} Shun's Blog. All rights reserved.
		</footer>
	);
}
