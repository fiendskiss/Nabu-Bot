export const submissionStatuses = [
  "new",
  "in_progress",
  "completed",
] as const;

export type SubmissionStatus = (typeof submissionStatuses)[number];

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
