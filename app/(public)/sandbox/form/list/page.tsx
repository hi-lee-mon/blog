import { getContacts } from "../contact";

export default async function Page() {
  const contacts = await getContacts();
  return (
    <ul className="mt-4 space-y-4 border p-4">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <p>名前: {contact.name}</p>
          <p>メールアドレス: {contact.email}</p>
          <p>メッセージ: {contact.message}</p>
          <p>作成日時: {contact.createdAt.toISOString()}</p>
        </li>
      ))}
    </ul>
  );
}
