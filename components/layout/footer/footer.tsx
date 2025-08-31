export default async function Footer() {
  "use cache";
  return (
    //  footerを画面下部に配置する場合、親要素のクラスに依存する。左記のクラスを親に設定すること。className="min-h-dvh flex flex-col"
    <footer className="sticky top-full mt-8 w-full border-t py-4 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Shun's Blog. All rights reserved.
    </footer>
  );
}
