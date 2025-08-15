"use server";

import { redirect } from "next/navigation";
import z from "zod";
import { ContactSchema } from "../_validation/contact";

type ActionState = {
  success: boolean;
  errors: {
    name?: string[];
    message?: string[];
  };
  serverError?: string;
};

export async function postContact(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name");
  const message = formData.get("message");

  // バリデーション
  const result = ContactSchema.safeParse({ name, message });

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
      },
    };
  }
  redirect("/sandbox/form/complete");
}
