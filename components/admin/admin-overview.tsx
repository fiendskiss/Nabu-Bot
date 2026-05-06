"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CalendarDays, Mail, MessageSquareText, RefreshCw } from "lucide-react";
import {
  AdminHeaderCard,
  AdminPanel,
  AdminSearchInput,
  EmptyState,
  StatusCard,
  SummaryCard,
  formatDate,
  formatPreferredDate,
  formatStatusLabel,
} from "@/components/admin/admin-ui";
import { formatTimeLabel } from "@/lib/time";
import {
  type BookingRecord,
  type ContactSubmissionRecord,
  type NewsletterSubmissionRecord,
  type SubmissionStatus,
} from "@/lib/submissions";
import { cn } from "@/lib/utils";

type OverviewTab = "bookings" | "contacts" | "newsletters";

type OverviewRow = {
  id: string;
  tab: OverviewTab;
  title: string;
  subtitle: string;
  detail: string;
  secondaryDetail?: string;
  createdAt: string;
  status: SubmissionStatus;
};

const overviewTabs = [
  {
    id: "bookings",
    label: "Bookings",
    icon: CalendarDays,
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: MessageSquareText,
  },
  {
    id: "newsletters",
    label: "Newsletter",
    icon: Mail,
  },
] satisfies {
  id: OverviewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[];

export default function AdminOverview({
  bookings,
  contacts,
  newsletters,
}: {
  bookings: BookingRecord[];
  contacts: ContactSubmissionRecord[];
  newsletters: NewsletterSubmissionRecord[];
}) {
  const [activeTab, setActiveTab] = useState<OverviewTab>("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;

  const allSubmissions = [...bookings, ...contacts, ...newsletters];
  const totalStatusCounts = {
    new: allSubmissions.filter((entry) => entry.status === "new").length,
    in_progress: allSubmissions.filter(
      (entry) => entry.status === "in_progress",
    ).length,
    completed: allSubmissions.filter((entry) => entry.status === "completed")
      .length,
  };
  const rows = useMemo(
    () => ({
      bookings: toBookingRows(bookings),
      contacts: toContactRows(contacts),
      newsletters: toNewsletterRows(newsletters),
    }),
    [bookings, contacts, newsletters],
  );
  const filteredRows = rows[activeTab].filter((entry) =>
    hasSearchQuery
      ? [entry.title, entry.subtitle, entry.detail, entry.secondaryDetail ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearchQuery)
      : true,
  );

  return (
    <div className="grid w-full min-w-0 gap-5">
      <AdminHeaderCard
        title="Overview"
        action={
          <AdminSearchInput
            id="dashboard-overview-search"
            label="Search"
            placeholder="Search names, emails, companies, or messages"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total" value={allSubmissions.length} />
        <StatusCard
          label="New"
          value={totalStatusCounts.new}
          accentClassName="bg-amber-200/90 shadow-[0_0_18px_rgba(253,230,138,0.35)]"
        />
        <StatusCard
          label="In Progress"
          value={totalStatusCounts.in_progress}
          accentClassName="bg-sky-300/85 shadow-[0_0_18px_rgba(125,211,252,0.35)]"
        />
        <StatusCard
          label="Completed"
          value={totalStatusCounts.completed}
          accentClassName="bg-emerald-300/85 shadow-[0_0_18px_rgba(110,231,183,0.35)]"
        />
      </div>

      <AdminPanel className="overflow-hidden p-0 sm:p-0">
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <OverviewGroupTitle label="Submissions" />
            <p className="mt-2 text-sm text-white/50">
              Newest submitted records appear first in every tab.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {overviewTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const tabCount = rows[tab.id].length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex min-h-12 items-center gap-2 rounded-[18px] border px-4 text-xs font-bold uppercase tracking-[0.18em] transition",
                    isActive
                      ? "border-white/20 bg-white text-black"
                      : "border-white/10 bg-white/[0.04] text-white/54 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  <tab.icon
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-black/70" : "text-white/42",
                    )}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.65rem] tracking-normal",
                      isActive ? "bg-black/10" : "bg-white/10",
                    )}
                  >
                    {tabCount}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-12 items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 text-xs font-bold uppercase tracking-[0.18em] text-white/54 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4 text-white/42" />
              Refresh
            </button>
          </div>
        </div>

        {filteredRows.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              label={
                hasSearchQuery
                  ? `No ${getTabLabel(activeTab).toLowerCase()} match "${deferredSearchQuery.trim()}".`
                  : `No ${getTabLabel(activeTab).toLowerCase()} to show yet.`
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[48rem]">
              <div className="grid grid-cols-[minmax(14rem,1.2fr)_minmax(16rem,1.4fr)_minmax(12rem,0.9fr)_minmax(9rem,0.65fr)] border-b border-white/10 px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/36">
                <span>{activeTab === "newsletters" ? "Subscriber" : "Name"}</span>
                <span>{activeTab === "bookings" ? "Booking" : "Details"}</span>
                <span>Date</span>
                <span className="text-right">Status</span>
              </div>

              <div className="divide-y divide-white/10">
                {filteredRows.map((entry) => (
                  <article
                    key={`${entry.tab}-${entry.id}`}
                    className="grid grid-cols-[minmax(14rem,1.2fr)_minmax(16rem,1.4fr)_minmax(12rem,0.9fr)_minmax(9rem,0.65fr)] items-center gap-4 px-5 py-5 transition hover:bg-white/[0.025]"
                  >
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-white">
                        {entry.title}
                      </h2>
                      <p className="mt-1 truncate text-sm text-white/48">
                        {entry.subtitle}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {entry.detail}
                      </p>
                      {entry.secondaryDetail ? (
                        <p className="mt-1 truncate text-sm text-white/46">
                          {entry.secondaryDetail}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {formatDate(entry.createdAt)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/36">
                        Submitted
                      </p>
                    </div>

                    <div className="justify-self-end">
                      <StatusBadge status={entry.status} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

function toBookingRows(bookings: BookingRecord[]): OverviewRow[] {
  return sortRowsByDate(
    bookings.map((entry) => ({
      id: entry.id,
      tab: "bookings",
      title: entry.name,
      subtitle: [entry.email, entry.company].filter(Boolean).join(" | "),
      detail: `${formatPreferredDate(entry.preferred_date)} ${formatTimeLabel(entry.preferred_time)}`,
      secondaryDetail: entry.focus,
      createdAt: entry.created_at,
      status: entry.status,
    })),
  );
}

function toContactRows(contacts: ContactSubmissionRecord[]): OverviewRow[] {
  return sortRowsByDate(
    contacts.map((entry) => ({
      id: entry.id,
      tab: "contacts",
      title: entry.name,
      subtitle: [entry.email, entry.company].filter(Boolean).join(" | "),
      detail: entry.subject || "Contact message",
      secondaryDetail: entry.message,
      createdAt: entry.created_at,
      status: entry.status,
    })),
  );
}

function toNewsletterRows(
  newsletters: NewsletterSubmissionRecord[],
): OverviewRow[] {
  return sortRowsByDate(
    newsletters.map((entry) => ({
      id: entry.id,
      tab: "newsletters",
      title: entry.email || "Unknown subscriber",
      subtitle: "Newsletter signup",
      detail: "Joined update list",
      createdAt: entry.created_at,
      status: entry.status,
    })),
  );
}

function sortRowsByDate(rows: OverviewRow[]) {
  return [...rows].sort(
    (entryA, entryB) =>
      getDateTime(entryB.createdAt) - getDateTime(entryA.createdAt),
  );
}

function getDateTime(value: string) {
  const dateTime = new Date(value).getTime();

  return Number.isNaN(dateTime) ? 0 : dateTime;
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em]",
        getStatusBadgeClassName(status),
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {formatStatusLabel(status)}
    </span>
  );
}

function getStatusBadgeClassName(status: SubmissionStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-300/25 bg-emerald-300/10 text-emerald-200";
    case "in_progress":
      return "border-sky-300/25 bg-sky-300/10 text-sky-200";
    default:
      return "border-amber-200/25 bg-amber-200/10 text-amber-100";
  }
}

function getTabLabel(tab: OverviewTab) {
  switch (tab) {
    case "contacts":
      return "Contacts";
    case "newsletters":
      return "Newsletter signups";
    default:
      return "Bookings";
  }
}

function OverviewGroupTitle({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-white/42">
      {label}
    </h2>
  );
}
