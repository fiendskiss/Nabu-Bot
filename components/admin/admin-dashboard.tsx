"use client";

import { useState } from "react";
import {
  type BookingRecord,
  type ContactSubmissionRecord,
  type NewsletterSubmissionRecord,
  type SubmissionStatus,
  submissionStatuses,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";

type AdminDashboardProps = {
  initialBookings: BookingRecord[];
  initialContacts: ContactSubmissionRecord[];
  initialNewsletters: NewsletterSubmissionRecord[];
};

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

export default function AdminDashboard({
  initialBookings,
  initialContacts,
  initialNewsletters,
}: AdminDashboardProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [contacts, setContacts] = useState(initialContacts);
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [updating, setUpdating] = useState<UpdatingState | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const updateStatus = async (
    table: "bookings" | "contact_submissions" | "newsletter_submissions",
    id: string,
    nextStatus: SubmissionStatus,
  ) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from(table)
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (table === "bookings") {
      setBookings((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, status: nextStatus } : entry,
        ),
      );
      return;
    }

    if (table === "contact_submissions") {
      setContacts((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, status: nextStatus } : entry,
        ),
      );
      return;
    }

    setNewsletters((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
  };

  const deleteEntry = async (
    table: "bookings" | "contact_submissions" | "newsletter_submissions",
    id: string,
  ) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase.from(table).delete().eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (table === "bookings") {
      setBookings((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    if (table === "contact_submissions") {
      setContacts((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    setNewsletters((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="grid gap-8">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-white">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Bookings" value={bookings.length} />
          <SummaryCard label="Contacts" value={contacts.length} />
          <SummaryCard label="Newsletter" value={newsletters.length} />
        </div>
        {errorMessage ? (
          <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>
        ) : null}
      </div>

      <SectionCard
        title="Bookings"
        description="Demo requests from the public booking form."
      >
        {bookings.length === 0 ? (
          <EmptyState label="No booking requests yet." />
        ) : (
          <div className="grid gap-4">
            {bookings.map((entry) => (
              <article
                key={entry.id}
                className="rounded-[24px] border border-white/10 bg-black/30 p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {entry.name}
                      </h3>
                      <p className="text-sm text-white/56">
                        {entry.email}
                        {entry.company ? ` · ${entry.company}` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-white/44">
                      <span>{formatDate(entry.created_at)}</span>
                      <span>{formatPreferredDate(entry.preferred_date)}</span>
                      <span>{formatPreferredTime(entry.preferred_time)}</span>
                    </div>

                    <p className="max-w-3xl text-sm leading-7 text-white/74">
                      {entry.focus}
                    </p>
                  </div>

                  <Actions
                    value={entry.status}
                    isBusy={updating?.id === entry.id}
                    onDelete={() => deleteEntry("bookings", entry.id)}
                    onStatusChange={(status) =>
                      updateStatus("bookings", entry.id, status)
                    }
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Contact Submissions"
        description="Messages sent from the contact page."
      >
        {contacts.length === 0 ? (
          <EmptyState label="No contact messages yet." />
        ) : (
          <div className="grid gap-4">
            {contacts.map((entry) => (
              <article
                key={entry.id}
                className="rounded-[24px] border border-white/10 bg-black/30 p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {entry.name}
                      </h3>
                      <p className="text-sm text-white/56">
                        {entry.email}
                        {entry.company ? ` · ${entry.company}` : ""}
                        {entry.subject ? ` · ${entry.subject}` : ""}
                      </p>
                    </div>

                    <div className="text-xs uppercase tracking-[0.24em] text-white/44">
                      {formatDate(entry.created_at)}
                    </div>

                    <p className="max-w-3xl text-sm leading-7 text-white/74">
                      {entry.message}
                    </p>
                  </div>

                  <Actions
                    value={entry.status}
                    isBusy={updating?.id === entry.id}
                    onDelete={() => deleteEntry("contact_submissions", entry.id)}
                    onStatusChange={(status) =>
                      updateStatus("contact_submissions", entry.id, status)
                    }
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Newsletter Submissions"
        description="Emails collected from the footer subscription flow."
      >
        {newsletters.length === 0 ? (
          <EmptyState label="No newsletter subscribers yet." />
        ) : (
          <div className="grid gap-4">
            {newsletters.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/30 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {entry.email}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/44">
                    {formatDate(entry.created_at)}
                  </p>
                </div>

                <Actions
                  value={entry.status}
                  isBusy={updating?.id === entry.id}
                  onDelete={() => deleteEntry("newsletter_submissions", entry.id)}
                  onStatusChange={(status) =>
                    updateStatus("newsletter_submissions", entry.id, status)
                  }
                />
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/38">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.84),rgba(10,10,10,0.68))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-white/38">
          Dashboard Section
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/62">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Actions({
  value,
  isBusy,
  onStatusChange,
  onDelete,
}: {
  value: SubmissionStatus;
  isBusy: boolean;
  onStatusChange: (status: SubmissionStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col items-stretch gap-3 lg:min-w-44">
      <select
        value={value}
        disabled={isBusy}
        onChange={(event) =>
          onStatusChange(event.target.value as SubmissionStatus)
        }
        className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-white/24"
      >
        {submissionStatuses.map((status) => (
          <option key={status} value={status} className="bg-[#050505]">
            {status.replace("_", " ")}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={isBusy}
        onClick={onDelete}
        className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/16 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? "Working..." : "Delete"}
      </button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/12 bg-black/20 p-6 text-sm text-white/56">
      {label}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPreferredDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatPreferredTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`1970-01-01T${value}:00`));
}
