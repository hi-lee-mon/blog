import LinkList from "./_component/link-list";

export default async function Page() {
  return (
    <div className="space-y-4">
      <LinkList importMetaUrl={import.meta.url} />
    </div>
  );
}
