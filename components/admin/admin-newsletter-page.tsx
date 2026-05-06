"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowRight, RefreshCw, X } from "lucide-react";
import {
  AdminHeaderCard,
  AdminPanel,
  AdminSearchInput,
  EmptyState,
  StatusBadge,
  StatusCard,
  SummaryCard,
  formatDate,
  formatStatusLabel,
  getStatusCounts,
  statusCardAccentClassName,
} from "@/components/admin/admin-ui";
import {
  submissionStatuses,
  type NewsletterSubmissionRecord,
  type SubmissionStatus,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

type StatusFilter = "all" | SubmissionStatus;

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(
    null,
  );
  const [draftStatus, setDraftStatus] = useState<SubmissionStatus>("new");

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
    const matchesSearch = hasSearchQuery
      ? (entry.email ?? "").toLowerCase().includes(normalizedSearchQuery)
      : true;
    const matchesStatus =
      statusFilter === "all" ? true : entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const newsletterStatusCounts = getStatusCounts(newsletters);
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

  const updateStatus = async (id: string, nextStatus: SubmissionStatus) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from("newsletter_submissions")
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(formatSubmissionError(error.message));
      return false;
    }

    setNewsletters((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
    return true;
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
      setErrorMessage(formatSubmissionError(error.message));
      return false;
    }

    setNewsletters((current) => current.filter((entry) => entry.id !== id));
    setSelectedNewsletterId(null);
    return true;
  };

  const saveSelectedNewsletter = async () => {
    if (!selectedNewsletter) {
      return;
    }

    if (selectedNewsletter.status === draftStatus) {
      setSelectedNewsletterId(null);
      return;
    }

    const didSave = await updateStatus(selectedNewsletter.id, draftStatus);

    if (didSave) {
      setSelectedNewsletterId(null);
    }
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <SummaryCard label="Total" value={newsletters.length} />
        {submissionStatuses.map((status) => (
          <StatusCard
            key={status}
            label={formatStatusLabel(status)}
            value={newsletterStatusCounts[status]}
            accentClassName={statusCardAccentClassName(status)}
          />
        ))}
      </div>

      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      <AdminPanel className="overflow-hidden p-0 sm:p-0">
        <DashboardToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

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
              <div className="grid grid-cols-[minmax(20rem,1.5fr)_minmax(14rem,0.9fr)_minmax(9rem,0.65fr)_2.5rem] border-b border-white/10 px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/36">
                <span>Subscriber</span>
                <span>Date</span>
                <span className="text-right">Status</span>
                <span />
              </div>

              <div className="divide-y divide-white/10">
                {filteredNewsletters.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setDraftStatus(entry.status);
                      setSelectedNewsletterId(entry.id);
                    }}
                    className="grid w-full grid-cols-[minmax(20rem,1.5fr)_minmax(14rem,0.9fr)_minmax(9rem,0.65fr)_2.5rem] items-center gap-4 px-5 py-5 text-left transition hover:bg-white/[0.025]"
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

                    <span className="justify-self-end">
                      <StatusBadge status={entry.status} />
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
          draftStatus={draftStatus}
          isBusy={updating?.id === selectedNewsletter.id}
          onClose={() => setSelectedNewsletterId(null)}
          onDelete={() => deleteEntry(selectedNewsletter.id)}
          onDraftStatusChange={setDraftStatus}
          onSave={saveSelectedNewsletter}
        />
      ) : null}
    </div>
  );
}

function DashboardToolbar({
  statusFilter,
  onStatusFilterChange,
}: {
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/42">
          Newsletter Queue
        </p>
        <p className="mt-2 text-sm text-white/50">
          Newest subscriber signups appear first.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton
          label="All"
          isActive={statusFilter === "all"}
          onClick={() => onStatusFilterChange("all")}
        />
        {submissionStatuses.map((status) => (
          <FilterButton
            key={status}
            label={formatStatusLabel(status)}
            isActive={statusFilter === status}
            onClick={() => onStatusFilterChange(status)}
          />
        ))}
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

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-[16px] border px-4 text-xs font-bold uppercase tracking-[0.16em] transition",
        isActive
          ? "border-violet-300/40 bg-[linear-gradient(135deg,#60A5FA_0%,#7C3AED_55%,#A855F7_100%)] text-white shadow-[0_16px_38px_rgba(124,58,237,0.28)]"
          : "border-white/10 bg-white/[0.04] text-white/54 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
      )}
    >
      {label}
    </button>
  );
}

function NewsletterDetailsDialog({
  newsletter,
  draftStatus,
  isBusy,
  onClose,
  onDelete,
  onDraftStatusChange,
  onSave,
}: {
  newsletter: NewsletterSubmissionRecord;
  draftStatus: SubmissionStatus;
  isBusy: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDraftStatusChange: (status: SubmissionStatus) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/72 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-details-title"
        className="w-full max-w-2xl overflow-hidden rounded-[26px] border border-white/12 bg-[#1a1513] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-6">
          <div className="min-w-0">
            <h2
              id="newsletter-details-title"
              className="truncate text-2xl font-black tracking-[-0.05em] text-white"
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
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/56 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            aria-label="Close newsletter details"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <DetailField label="Email" value={newsletter.email || "Not provided"} />
            <DetailField label="Submitted" value={formatDate(newsletter.created_at)} />
            <DetailField
              label="Current Status"
              value={formatStatusLabel(newsletter.status)}
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/38">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {submissionStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isBusy}
                  onClick={() => onDraftStatusChange(status)}
                  className={cn(
                    "min-h-10 rounded-full border px-4 text-xs font-bold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60",
                    draftStatus === status
                      ? "border-violet-300/45 bg-violet-400/14 text-violet-100 shadow-[0_10px_30px_rgba(124,58,237,0.18)]"
                      : "border-white/10 bg-transparent text-white/42 hover:border-white/20 hover:text-white/78",
                  )}
                >
                  {formatStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
            <button
              type="button"
              disabled={isBusy}
              onClick={onSave}
              className="min-h-14 rounded-[18px] bg-[linear-gradient(135deg,#60A5FA_0%,#7C3AED_55%,#A855F7_100%)] px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_44px_rgba(124,58,237,0.26)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onDelete}
              className="min-h-14 rounded-[18px] border border-white/10 bg-transparent px-5 text-sm font-black uppercase tracking-[0.12em] text-white/46 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete
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
  if (message.includes("status_check") || message.includes("check constraint")) {
    return "The live database still needs the new status migration before this status can be saved.";
  }

  return message;
}
