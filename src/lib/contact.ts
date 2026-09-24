export const inquiryTypes = [
  "Investment Inquiry",
  "Partnership",
  "Media & Press",
  "Speaking",
  "Mentorship",
  "Other",
] as const;

export type ContactField =
  | "firstName"
  | "lastName"
  | "email"
  | "organisation"
  | "inquiryType"
  | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};
