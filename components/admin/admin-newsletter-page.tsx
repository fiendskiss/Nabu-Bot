"use client";

import { useDeferredValue, useState } from "react";
import {
  AdminHeaderCard,
  AdminSearchInput,
  AdminSidePanel,
  EmptyState,
  SubmissionActions,
  SummaryCard,
  formatDate,
} from "@/components/admin/admin-ui";
import {
  type NewsletterSubmissionRecord,
  type SubmissionStatus,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

export default function AdminNewsletterPage({
  initialNewsletters,
  initialErrorMessage = "",
}: {
  initialNewsletters: NewsletterSubmissionRecord[];
  initialErrorMessage?: string;
}) {
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [updating, setUpdating] = useState<UpdatingState | null>(null);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const filteredNewsletters = newsletters.filter((entry) =>
    hasSearchQuery
      ? (entry.email ?? "").toLowerCase().includes(normalizedSearchQuery)
      : true,
  );
  const totalSubscribed = newsletters.length;

  const updateStatus = async (id: string, nextStatus: SubmissionStatus) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from("newsletter_submissions")
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setNewsletters((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
  };

  const deleteEntry = async (id: string) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase
      .from("newsletter_submissions")
      .delete()
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setNewsletters((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="grid w-full min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24vw)] 2xl:grid-cols-[minmax(0,1fr)_minmax(20rem,26vw)] xl:items-start">
      <div className="grid min-w-0 gap-5">
        <AdminHeaderCard
          title="Newsletter"
          action={
            <AdminSearchInput
              id="dashboard-newsletter-search"
              label="Search"
              placeholder="Search NABU subscriber emails"
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

        {filteredNewsletters.length === 0 ? (
          <EmptyState
            label={
              hasSearchQuery
                ? `No newsletter submissions match "${deferredSearchQuery.trim()}".`
                : "No one has joined the NABU update list yet."
            }
          />
        ) : (
          <div className="grid gap-4">
            {filteredNewsletters.map((entry) => (
              <article
                key={entry.id}
                className="grid gap-5 rounded-[24px] border border-white/10 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] xl:grid-cols-[minmax(0,1fr)_minmax(15rem,20vw)] xl:items-start"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white">
                    {entry.email || "Unknown subscriber"}
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/44">
                    {formatDate(entry.created_at)}
                  </p>
                </div>

                <div className="w-full xl:justify-self-end">
                  <SubmissionActions
                    value={entry.status}
                    isBusy={updating?.id === entry.id}
                    onDelete={() => deleteEntry(entry.id)}
                    onStatusChange={(status) => updateStatus(entry.id, status)}
                    hideStatusControl
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="min-w-0 xl:sticky xl:top-5">
        <AdminSidePanel title="Subscribers">
          <SummaryCard label="Total Subscribed" value={totalSubscribed} />
        </AdminSidePanel>
      </aside>
    </div>
  );
}
