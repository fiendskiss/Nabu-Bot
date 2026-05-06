export const submissionStatuses = [
  "new",
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;

export type SubmissionStatus = (typeof submissionStatuses)[number];

export function formatStatusLabel(value: SubmissionStatus) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getStatusCounts<T extends { status: SubmissionStatus }>(
  entries: T[],
) {
  return Object.fromEntries(
    submissionStatuses.map((status) => [
      status,
      entries.filter((entry) => entry.status === status).length,
    ]),
  ) as Record<SubmissionStatus, number>;
}

export function getStatusAccentClassName(value: SubmissionStatus) {
  switch (value) {
    case "completed":
      return "bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.45)]";
    case "confirmed":
      return "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.45)]";
    case "cancelled":
      return "bg-rose-300 shadow-[0_0_18px_rgba(253,164,175,0.42)]";
    case "pending":
      return "bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.42)]";
    default:
      return "bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.28)]";
  }
}

export function getStatusBadgeClassName(value: SubmissionStatus) {
  switch (value) {
    case "completed":
      return "border-blue-300/30 bg-blue-400/12 text-blue-300";
    case "confirmed":
      return "border-emerald-300/25 bg-emerald-300/10 text-emerald-200";
    case "cancelled":
      return "border-rose-300/25 bg-rose-300/10 text-rose-200";
    case "pending":
      return "border-yellow-300/25 bg-yellow-300/10 text-yellow-200";
    default:
      return "border-white/18 bg-white/[0.06] text-white/82";
  }
}

export type BookingRecord = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  preferred_date: string;
  preferred_time: string;
  focus: string;
  status: SubmissionStatus;
  created_at: string;
};

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string | null;
  message: string;
  status: SubmissionStatus;
  created_at: string;
};

export type NewsletterSubmissionRecord = {
  id: string;
  email: string;
  status: SubmissionStatus;
  created_at: string;
};
