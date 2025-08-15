import { z } from "zod";

export const ContactSchema = z.object({
  name: z
    .string()
    .min(3, "名前は3文字以上で入力してください")
    .max(100, "名前は20文字以内で入力してください"),
  message: z
    .string()
    .min(3, "メッセージは10文字以上で入力してください")
    .max(100, "メッセージは100文字以内で入力してください"),
  email: z.email("メールアドレスが不正です"),
});

export type ContactType = z.infer<typeof ContactSchema>;
