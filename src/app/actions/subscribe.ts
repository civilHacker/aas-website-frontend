"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message?: string;
  email?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      email,
    };
  }

  const supabase = createAdminClient();
  const { data: existing, error: lookupError } = await supabase
    .from("subscribers")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (!lookupError && existing.length > 0) {
    return {
      status: "success",
      message: "You're already subscribed — thanks!",
    };
  }

  const { error } = await supabase
    .from("subscribers")
    .insert({ email, subscribed_at: Date.now() });

  if (error) {
    console.error("Newsletter signup failed:", error.message);
    return {
      status: "error",
      message: "Couldn't subscribe you right now. Please try again.",
      email,
    };
  }

  return {
    status: "success",
    message: "You're in! Look out for the next issue.",
  };
}
