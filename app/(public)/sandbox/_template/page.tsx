import LinkList from "../_component/link-list";

export default function Page() {
  return <LinkList importMetaUrl={import.meta.url} />;
}
