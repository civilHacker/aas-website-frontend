"use server";

import type { SubmissionField as Field, SubmissionState } from "@/lib/problem-submission";
import { createAdminClient } from "@/lib/supabase/admin";

const LIMITS: Record<Field, number> = {
  submitterName: 100,
  submitterEmail: 254,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitProblem(
  _prev: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  // Bots fill every field, including this one hidden from people.
  if (formData.get("website")) return { status: "success" };

  const values = Object.fromEntries(
    (Object.keys(LIMITS) as Field[]).map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as Record<Field, string>;

  const problemId = String(formData.get("problemId") ?? "").trim();
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  const fileName = String(formData.get("fileName") ?? "").trim();
  const fileType = String(formData.get("fileType") ?? "").trim();

  const errors: SubmissionState["errors"] = {};
  if (!values.submitterName) errors.submitterName = "Please enter your name.";
  if (!EMAIL.test(values.submitterEmail)) errors.submitterEmail = "Please enter a valid email.";
  for (const field of Object.keys(LIMITS) as Field[]) {
    if (values[field].length > LIMITS[field]) {
      errors[field] = `Please keep this under ${LIMITS[field]} characters.`;
    }
  }
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }
  if (!problemId || !fileUrl || !fileName) {
    return { status: "error", message: "Please choose a file to upload first.", values };
  }

  const { error } = await createAdminClient()
    .from("problem_submissions")
    .insert({
      problem_id: problemId,
      submitter_name: values.submitterName,
      submitter_email: values.submitterEmail,
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType || "unknown",
      status: "pending",
      created_at: Date.now(),
    });

  if (error) {
    console.error("Problem submission insert failed:", error.message);
    return {
      status: "error",
      message: "Something went wrong saving your submission. Please try again.",
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks — your submission has been received and will be reviewed.",
  };
}
