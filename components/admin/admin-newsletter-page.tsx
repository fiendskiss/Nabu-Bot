"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowRight, RefreshCw, X } from "lucide-react";
import {
  AdminHeaderCard,
  AdminPanel,
  AdminSearchInput,
  EmptyState,
  SummaryCard,
  formatDate,
} from "@/components/admin/admin-ui";
import { type NewsletterSubmissionRecord } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";

type UpdatingState = {
  id: string;
  action: "delete";
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
  const [deletedSubscriberCount, setDeletedSubscriberCount] = useState(0);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(
    null,
  );

  const supabase = createClient();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const sortedNewsletters = useMemo(
    () =>
      [...newsletters].sort(
        (entryA, entryB) =>
          getDateTime(entryB.created_at) - getDateTime(entryA.created_at),
      ),
    [newsletters],
  );
  const filteredNewsletters = sortedNewsletters.filter((entry) => {
    return hasSearchQuery
      ? (entry.email ?? "").toLowerCase().includes(normalizedSearchQuery)
      : true;
  });
  const selectedNewsletter =
    newsletters.find((entry) => entry.id === selectedNewsletterId) ?? null;

  useEffect(() => {
    if (!selectedNewsletter) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedNewsletterId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedNewsletter]);

  const deleteEntry = async (id: string) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase
      .from("newsletter_submissions")
      .delete()
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(formatSubmissionError(error.message));
      return false;
    }

    setNewsletters((current) => current.filter((entry) => entry.id !== id));
    setDeletedSubscriberCount((current) => current + 1);
    setSelectedNewsletterId(null);
    return true;
  };

  return (
    <div className="grid w-full min-w-0 gap-5">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard label="Total" value={newsletters.length} />
        <SummaryCard label="Deleted" value={deletedSubscriberCount} />
      </div>

      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      <AdminPanel className="overflow-hidden p-0 sm:p-0">
        <DashboardToolbar />

        {filteredNewsletters.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              label={
                hasSearchQuery
                  ? `No newsletter submissions match "${deferredSearchQuery.trim()}".`
                  : "No one has joined the NABU update list yet."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[48rem]">
              <div className="grid grid-cols-[minmax(20rem,1.5fr)_minmax(14rem,0.9fr)_2.5rem] border-b border-white/10 px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/36">
                <span>Subscribers</span>
                <span>Date</span>
                <span />
              </div>

              <div className="divide-y divide-white/10">
                {filteredNewsletters.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSelectedNewsletterId(entry.id)}
                    className="grid w-full grid-cols-[minmax(20rem,1.5fr)_minmax(14rem,0.9fr)_2.5rem] items-center gap-4 px-5 py-5 text-left transition hover:bg-white/[0.025]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-base font-semibold text-white">
                        {entry.email || "Unknown subscriber"}
                      </span>
                      <span className="mt-1 block truncate text-sm text-white/48">
                        Newsletter signup
                      </span>
                    </span>

                    <span>
                      <span className="block text-sm font-semibold text-white">
                        {formatDate(entry.created_at)}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-white/36">
                        Submitted
                      </span>
                    </span>

                    <ArrowRight className="h-4 w-4 justify-self-end text-white/28" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminPanel>

      {selectedNewsletter ? (
        <NewsletterDetailsDialog
          newsletter={selectedNewsletter}
          isBusy={updating?.id === selectedNewsletter.id}
          onClose={() => setSelectedNewsletterId(null)}
          onDelete={() => deleteEntry(selectedNewsletter.id)}
        />
      ) : null}
    </div>
  );
}

function DashboardToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/42">
          Newsletter Queue
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-white/10 bg-white/[0.04] px-4 text-xs font-bold uppercase tracking-[0.16em] text-white/54 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4 text-white/42" />
          Refresh
        </button>
      </div>
    </div>
  );
}

function NewsletterDetailsDialog({
  newsletter,
  isBusy,
  onClose,
  onDelete,
}: {
  newsletter: NewsletterSubmissionRecord;
  isBusy: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/72 px-2 py-2 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-details-title"
        className="flex max-h-[calc(100svh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[22px] border border-white/12 bg-[#151515] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:max-h-[calc(100svh-3rem)] sm:rounded-[26px]"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <h2
              id="newsletter-details-title"
              className="truncate text-xl font-black tracking-[-0.05em] text-white sm:text-2xl"
            >
              {newsletter.email || "Unknown subscriber"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/42">
              Newsletter signup | {formatDate(newsletter.created_at)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/56 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:h-11 sm:w-11"
            aria-label="Close newsletter details"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-4 overflow-y-auto px-4 py-4 sm:gap-6 sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <DetailField label="Email" value={newsletter.email || "Not provided"} />
            <DetailField label="Submitted" value={formatDate(newsletter.created_at)} />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={isBusy}
              onClick={onDelete}
              className="min-h-12 rounded-[18px] border border-white/10 bg-transparent px-5 text-sm font-black uppercase tracking-[0.12em] text-white/46 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14"
            >
              {isBusy ? "Working..." : "Delete"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/38">
        {label}
      </p>
      <p className="mt-2 break-words text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function getDateTime(value: string) {
  const dateTime = new Date(value).getTime();

  return Number.isNaN(dateTime) ? 0 : dateTime;
}

function formatSubmissionError(message: string) {
  return message;
}
