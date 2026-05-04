"use client";

import { useDeferredValue, useState } from "react";
import {
  AdminHeaderCard,
  AdminSearchInput,
  AdminSidePanel,
  EmptyState,
  StatusCard,
  SubmissionActions,
  formatDate,
} from "@/components/admin/admin-ui";
import {
  type ContactSubmissionRecord,
  type SubmissionStatus,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

export default function AdminContactPage({
  initialContacts,
  initialErrorMessage = "",
}: {
  initialContacts: ContactSubmissionRecord[];
  initialErrorMessage?: string;
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [updating, setUpdating] = useState<UpdatingState | null>(null);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const filteredContacts = contacts.filter((entry) =>
    hasSearchQuery
      ? [
          entry.name,
          entry.email,
          entry.company ?? "",
          entry.subject ?? "",
          entry.message,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearchQuery)
      : true,
  );
  const contactStatusCounts = {
    new: contacts.filter((entry) => entry.status === "new").length,
    in_progress: contacts.filter((entry) => entry.status === "in_progress")
      .length,
    completed: contacts.filter((entry) => entry.status === "completed").length,
  };

  const updateStatus = async (id: string, nextStatus: SubmissionStatus) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setContacts((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
  };

  const deleteEntry = async (id: string) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setContacts((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
      <div className="grid gap-6">
        <AdminHeaderCard
          title="Contact"
          description="Read contact form submissions, track response progress, and remove handled messages."
          action={
            <AdminSearchInput
              id="dashboard-contact-search"
              label="Search"
              placeholder="Search names, emails, subjects, or message text"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          }
        />

        {errorMessage ? (
          <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        {filteredContacts.length === 0 ? (
          <EmptyState
            label={
              hasSearchQuery
                ? `No contact submissions match "${deferredSearchQuery.trim()}".`
                : "No contact messages yet."
            }
          />
        ) : (
          <div className="grid gap-4">
            {filteredContacts.map((entry) => (
              <article
                key={entry.id}
                className="grid gap-6 rounded-[24px] border border-white/10 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-start"
              >
                <div className="min-w-0 space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {entry.name}
                    </h2>
                    <p className="text-sm text-white/56">
                      {entry.email}
                      {entry.company ? ` | ${entry.company}` : ""}
                      {entry.subject ? ` | ${entry.subject}` : ""}
                    </p>
                  </div>

                  <div className="text-xs uppercase tracking-[0.24em] text-white/44">
                    {formatDate(entry.created_at)}
                  </div>

                  <p className="max-w-4xl text-sm leading-7 text-white/74">
                    {entry.message}
                  </p>
                </div>

                <div className="w-full xl:justify-self-end">
                  <SubmissionActions
                    value={entry.status}
                    isBusy={updating?.id === entry.id}
                    onDelete={() => deleteEntry(entry.id)}
                    onStatusChange={(status) => updateStatus(entry.id, status)}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="xl:sticky xl:top-6">
        <AdminSidePanel
          title="Contact Pipeline"
          description="Keep live response totals visible while triaging incoming messages."
        >
          <StatusCard
            label="New Contacts"
            value={contactStatusCounts.new}
            accentClassName="bg-amber-200/90 shadow-[0_0_18px_rgba(253,230,138,0.35)]"
          />
          <StatusCard
            label="In Progress"
            value={contactStatusCounts.in_progress}
            accentClassName="bg-sky-300/85 shadow-[0_0_18px_rgba(125,211,252,0.35)]"
          />
          <StatusCard
            label="Completed"
            value={contactStatusCounts.completed}
            accentClassName="bg-emerald-300/85 shadow-[0_0_18px_rgba(110,231,183,0.35)]"
          />
        </AdminSidePanel>
      </aside>
    </div>
  );
}
