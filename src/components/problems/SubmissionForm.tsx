"use client";

import { ChangeEvent, useActionState, useState } from "react";
import { submitProblem } from "@/app/actions/submitProblem";
import type { SubmissionField, SubmissionState } from "@/lib/problem-submission";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const ACCEPTED = ".mp4,.mov,.webm,.xlsx,.xls,.csv,.pdf";

const fieldClass =
  "h-[43px] w-full rounded-[14px] border-[0.5px] border-[#626262] bg-white/7 pr-[5px] pl-[11px] text-[16px] leading-[1.3] text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/60 aria-invalid:border-[#ff8a80]";

const labelClass = "text-[16px] leading-[1.3] text-white/80";

const initialState: SubmissionState = { status: "idle" };

export function SubmissionForm({ problemId }: { problemId: string }) {
  const [state, formAction, pending] = useActionState(submitProblem, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fieldProps = (name: SubmissionField) => ({
    name,
    defaultValue: state.values?.[name],
    "aria-invalid": state.errors?.[name] ? true : undefined,
    "aria-describedby": state.errors?.[name] ? `${name}-error` : undefined,
  });

  const fieldError = (name: SubmissionField) =>
    state.errors?.[name] && (
      <span id={`${name}-error`} className="text-[13px] text-[#ff8a80]">
        {state.errors[name]}
      </span>
    );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_BYTES) {
      setUploadError(`That file is too large (max ${MAX_FILE_BYTES / (1024 * 1024)}MB).`);
      return;
    }
    setUploadError("");
    setFile(selected);
    setFileUrl("");
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${problemId}/${Date.now()}-${selected.name}`;
      const { error } = await supabase.storage.from("submissions").upload(path, selected);
      if (error) throw error;
      const { data } = supabase.storage.from("submissions").getPublicUrl(path);
      setFileUrl(data.publicUrl);
    } catch (err) {
      console.error("Submission file upload failed:", err);
      setUploadError("Couldn't upload that file. Please try again.");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  if (state.status === "success") {
    return (
      <p role="status" className="text-[16px] text-white/80">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} noValidate className="flex w-full flex-col gap-[14px]">
      <input type="hidden" name="problemId" value={problemId} />
      <input type="hidden" name="fileUrl" value={fileUrl} />
      <input type="hidden" name="fileName" value={file?.name ?? ""} />
      <input type="hidden" name="fileType" value={file?.type ?? ""} />

      <div className="flex flex-col gap-[7px]">
        <span className={labelClass}>Your solution (video, Excel, or PDF)</span>
        <label className="flex h-[43px] w-full cursor-pointer items-center rounded-[14px] border-[0.5px] border-dashed border-[#626262] bg-white/7 px-[11px] text-[16px] text-white/60 hover:bg-white/10">
          {uploading ? "Uploading…" : file ? file.name : "Choose a file…"}
          <input type="file" accept={ACCEPTED} onChange={handleFileChange} className="hidden" />
        </label>
        {uploadError ? <span className="text-[13px] text-[#ff8a80]">{uploadError}</span> : null}
      </div>

      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Your name</span>
        <input {...fieldProps("submitterName")} placeholder="Jane Doe" required maxLength={100} className={fieldClass} />
        {fieldError("submitterName")}
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Email</span>
        <input
          {...fieldProps("submitterEmail")}
          type="email"
          placeholder="you@email.com"
          required
          maxLength={254}
          className={fieldClass}
        />
        {fieldError("submitterEmail")}
      </label>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={pending || uploading || !fileUrl}
        className="flex h-[43px] w-full items-center justify-center rounded-[10px] bg-accent px-[18px] font-manrope text-[14px] font-semibold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Submitting…" : "Submit solution"}
      </button>

      {state.status === "error" ? (
        <p role="status" aria-live="polite" className="text-[14px] text-[#ff8a80]">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
