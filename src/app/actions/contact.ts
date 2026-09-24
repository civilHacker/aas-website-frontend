"use server";

import {
  inquiryTypes,
  type ContactField as Field,
  type ContactState,
} from "@/lib/contact";
import { createAdminClient } from "@/lib/supabase/admin";

const LIMITS: Record<Field, number> = {
  firstName: 100,
  lastName: 100,
  email: 254,
  organisation: 200,
  inquiryType: 50,
  message: 5000,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Bots fill every field, including this one hidden from people.
  if (formData.get("website")) return { status: "success" };

  const values = Object.fromEntries(
    (Object.keys(LIMITS) as Field[]).map((field) => [
      field,
      String(formData.get(field) ?? "").trim(),
    ]),
  ) as Record<Field, string>;

  const errors: ContactState["errors"] = {};
  if (!values.firstName) errors.firstName = "Please enter your first name.";
  if (!values.lastName) errors.lastName = "Please enter your last name.";
  if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email.";
  if (!inquiryTypes.includes(values.inquiryType as never))
    errors.inquiryType = "Please choose an inquiry type.";
  if (!values.message) errors.message = "Please write a message.";
  for (const field of Object.keys(LIMITS) as Field[]) {
    if (values[field].length > LIMITS[field])
      errors[field] = `Please keep this under ${LIMITS[field]} characters.`;
  }
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values,
    };
  }

  const { error } = await createAdminClient()
    .from("contacts")
    .insert({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      organisation: values.organisation || null,
      inquiry_type: values.inquiryType,
      message: values.message,
      created_at: Date.now(),
    });

  if (error) {
    console.error("Contact form insert failed:", error.message);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks — your message has been sent. I'll be in touch soon.",
  };
}
