export type SubmissionField = "submitterName" | "submitterEmail";

export type SubmissionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<SubmissionField, string>>;
  values?: Partial<Record<SubmissionField, string>>;
};
