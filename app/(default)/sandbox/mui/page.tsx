import LinkList from "../_component/link-list";

export default function Page() {
  return (
    <div>
      <LinkList importMetaUrl={import.meta.url} />
    </div>
  );
}
