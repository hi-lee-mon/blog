"use client";

import { useActionState, useState } from "react";
import z from "zod";
import { postContact } from "../_action/contact";
import { ContactSchema } from "../_validation/contact";

export default function ContactForm() {
  const [clientErrors, setClientErrors] = useState({
    name: "",
    message: "",
  });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      if (name === "name") {
        ContactSchema.pick({ name: true }).parse({ name: value });
      } else if (name === "message") {
        ContactSchema.pick({ message: true }).parse({ message: value });
      }
      // errorがthrowされなかった場合はblurされたフィールド名のエラーメッセージをクリア
      setClientErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = z.flattenError(error).fieldErrors as {
          name?: string[];
          message?: string[];
        };

        console.log(fieldErrors);
        setClientErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name as keyof typeof fieldErrors]?.join(", "),
        }));
      }
    }
  };

  const [state, formAction] = useActionState(postContact, {
    success: false,
    errors: {},
  });
  return (
    <div>
      <h1>Contact Form</h1>
      <form action={formAction}>
        <label htmlFor="name">Name</label>
        <input
          className="border"
          type="text"
          id="name"
          name="name"
          onBlur={handleBlur}
        />
        {clientErrors.name && (
          <p className="text-red-500">{clientErrors.name}</p>
        )}
        {state.errors.name && (
          <p className="text-red-500">{state.errors.name.join(", ")}</p>
        )}
        <label htmlFor="message">Message</label>
        <textarea className="border" id="message" name="message" />
        {clientErrors.message && (
          <p className="text-red-500">{clientErrors.message}</p>
        )}
        {state.errors.message && (
          <p className="text-red-500">{state.errors.message.join(", ")}</p>
        )}
        <button className="border bg-blue-500" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
