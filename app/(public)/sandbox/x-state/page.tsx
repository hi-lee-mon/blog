import LinkList from "../_component/link-list";

export default function Page() {
  return (
    <div>
      <LinkList importMetaUrl={import.meta.url} />
      <a
        className="text-blue-400 hover:underline"
        href="https://zenn.dev/hayato94087/books/0a206dc72782be/viewer/g000ckhoqh5k64"
      >
        こちらのサイトを参考に実装
      </a>
    </div>
  );
}
