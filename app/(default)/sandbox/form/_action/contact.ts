"use server";

import { redirect } from "next/navigation";
import z from "zod";
import prisma from "@/lib/prisma";
import { ContactSchema } from "../_validation/contact";

type ActionState = {
  success: boolean;
  errors: {
    name?: string[];
    message?: string[];
    email?: string[];
  };
  serverError?: string;
};

export async function postContact(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name");
  const message = formData.get("message");
  const email = formData.get("email");

  // バリデーション
  const result = ContactSchema.safeParse({ name, message, email });

  if (!result.success) {
    console.log(
      "エラーが発生しました",
      z.flattenError(result.error).fieldErrors,
    );
    // console.log("エラーが発生しました", z.treeifyError(result.error));
    const errors = z.flattenError(result.error).fieldErrors;
    return {
      success: false,
      errors: {
        name: errors.name || [],
        message: errors.message || [],
        email: errors.email || [],
      },
    };
  }

  console.log(result);

  const existingContact = await prisma.contact.findUnique({
    where: {
      email: result.data.email,
    },
  });

  console.log(existingContact);
  if (existingContact) {
    return {
      success: false,
      errors: {
        email: ["このメールアドレスは既に登録されています"],
      },
    };
  }
  await prisma.contact.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      message: result.data.message,
    },
  });
  redirect("/sandbox/form/complete");
}
