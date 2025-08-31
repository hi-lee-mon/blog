import prisma from "@/lib/prisma";

export async function getContact(id: string) {
  const contact = await prisma.contact.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      createdAt: true,
    },
  });
  return contact;
}

export async function getContacts() {
  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return contacts;
}
