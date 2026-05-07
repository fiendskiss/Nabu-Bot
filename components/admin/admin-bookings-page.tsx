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
  formatPreferredDate,
  formatStatusLabel,
  getStatusCounts,
  statusCardAccentClassName,
} from "@/components/admin/admin-ui";
import { formatTimeLabel } from "@/lib/time";
import {
  submissionStatuses,
  type BookingRecord,
  type SubmissionStatus,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

type StatusFilter = "all" | SubmissionStatus;

export default function AdminBookingsPage({
  initialBookings,
}: {
  initialBookings: BookingRecord[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updating, setUpdating] = useState<UpdatingState | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<SubmissionStatus>("new");

  const supabase = createClient();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const sortedBookings = useMemo(
    () =>
      [...bookings].sort(
        (entryA, entryB) =>
          getDateTime(entryB.created_at) - getDateTime(entryA.created_at),
      ),
    [bookings],
  );
  const filteredBookings = sortedBookings.filter((entry) => {
    const matchesSearch = hasSearchQuery
      ? [
          entry.name,
          entry.email,
          entry.company ?? "",
          entry.focus,
          entry.preferred_date,
          entry.preferred_time,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearchQuery)
      : true;
    const matchesStatus =
      statusFilter === "all" ? true : entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const bookingStatusCounts = getStatusCounts(bookings);
  const selectedBooking =
    bookings.find((entry) => entry.id === selectedBookingId) ?? null;

  useEffect(() => {
    if (!selectedBooking) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedBookingId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedBooking]);

  const updateStatus = async (id: string, nextStatus: SubmissionStatus) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(formatSubmissionError(error.message));
      return false;
    }

    setBookings((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
    return true;
  };

  const deleteEntry = async (id: string) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(formatSubmissionError(error.message));
      return false;
    }

    setBookings((current) => current.filter((entry) => entry.id !== id));
    setSelectedBookingId(null);
    return true;
  };

  const saveSelectedBooking = async () => {
    if (!selectedBooking) {
      return;
    }

    if (selectedBooking.status === draftStatus) {
      setSelectedBookingId(null);
      return;
    }

    const didSave = await updateStatus(selectedBooking.id, draftStatus);

    if (didSave) {
      setSelectedBookingId(null);
    }
  };

  return (
    <div className="grid w-full min-w-0 gap-5">
      <AdminHeaderCard
        title="Bookings"
        action={
          <AdminSearchInput
            id="dashboard-bookings-search"
            label="Search"
            placeholder="Search name, email, company, focus, or date"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <SummaryCard label="Total" value={bookings.length} />
        {submissionStatuses.map((status) => (
          <StatusCard
            key={status}
            label={formatStatusLabel(status)}
            value={bookingStatusCounts[status]}
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

        {filteredBookings.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              label={
                hasSearchQuery
                  ? `No booking requests match "${deferredSearchQuery.trim()}".`
                  : "No NABU demo requests are waiting for review."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[52rem]">
              <div className="grid grid-cols-[minmax(14rem,1.2fr)_minmax(15rem,1.1fr)_minmax(13rem,0.9fr)_minmax(9rem,0.65fr)_2.5rem] border-b border-white/10 px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/36">
                <span>Client</span>
                <span>Booking</span>
                <span>Date</span>
                <span className="text-right">Status</span>
                <span />
              </div>

              <div className="divide-y divide-white/10">
                {filteredBookings.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setDraftStatus(entry.status);
                      setSelectedBookingId(entry.id);
                    }}
                    className="grid w-full grid-cols-[minmax(14rem,1.2fr)_minmax(15rem,1.1fr)_minmax(13rem,0.9fr)_minmax(9rem,0.65fr)_2.5rem] items-center gap-4 px-5 py-5 text-left transition hover:bg-white/[0.025]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-base font-semibold text-white">
                        {entry.name}
                      </span>
                      <span className="mt-1 block truncate text-sm text-white/48">
                        {entry.email}
                        {entry.company ? ` | ${entry.company}` : ""}
                      </span>
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {formatTimeLabel(entry.preferred_time)}
                      </span>
                      <span className="mt-1 block truncate text-sm text-white/46">
                        {entry.focus}
                      </span>
                    </span>

                    <span>
                      <span className="block text-sm font-semibold text-white">
                        {formatPreferredDate(entry.preferred_date)}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-white/36">
                        Submitted {formatDate(entry.created_at)}
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

      {selectedBooking ? (
        <BookingDetailsDialog
          booking={selectedBooking}
          draftStatus={draftStatus}
          isBusy={updating?.id === selectedBooking.id}
          onClose={() => setSelectedBookingId(null)}
          onDelete={() => deleteEntry(selectedBooking.id)}
          onDraftStatusChange={setDraftStatus}
          onSave={saveSelectedBooking}
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
          Booking Queue
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

function BookingDetailsDialog({
  booking,
  draftStatus,
  isBusy,
  onClose,
  onDelete,
  onDraftStatusChange,
  onSave,
}: {
  booking: BookingRecord;
  draftStatus: SubmissionStatus;
  isBusy: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDraftStatusChange: (status: SubmissionStatus) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/72 px-2 py-2 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-title"
        className="flex max-h-[calc(100svh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[22px] border border-white/12 bg-[#151515] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:max-h-[calc(100svh-3rem)] sm:rounded-[26px]"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <h2
              id="booking-details-title"
              className="truncate text-xl font-black tracking-[-0.05em] text-white sm:text-2xl"
            >
              {booking.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/42">
              {formatPreferredDate(booking.preferred_date)} |{" "}
              {formatTimeLabel(booking.preferred_time)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/56 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:h-11 sm:w-11"
            aria-label="Close booking details"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-4 overflow-y-auto px-4 py-4 sm:gap-6 sm:px-6 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <DetailField label="Name" value={booking.name} />
            <DetailField label="Company" value={booking.company || "Not provided"} />
            <DetailField label="Email" value={booking.email} />
            <DetailField label="Submitted" value={formatDate(booking.created_at)} />
            <DetailField
              label="Preferred Date"
              value={formatPreferredDate(booking.preferred_date)}
            />
            <DetailField
              label="Preferred Time"
              value={formatTimeLabel(booking.preferred_time)}
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/38">
              Focus
            </p>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-7 text-white/78">
              {booking.focus}
            </div>
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
                    "min-h-9 rounded-full border px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:px-4 sm:text-xs",
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
              className="min-h-12 rounded-[18px] bg-[linear-gradient(135deg,#60A5FA_0%,#7C3AED_55%,#A855F7_100%)] px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_44px_rgba(124,58,237,0.26)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14"
            >
              {isBusy ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onDelete}
              className="min-h-12 rounded-[18px] border border-white/10 bg-transparent px-5 text-sm font-black uppercase tracking-[0.12em] text-white/46 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14"
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
