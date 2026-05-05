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
  formatPreferredDate,
} from "@/components/admin/admin-ui";
import { formatTimeLabel } from "@/lib/time";
import { type BookingRecord, type SubmissionStatus } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

export default function AdminBookingsPage({
  initialBookings,
}: {
  initialBookings: BookingRecord[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updating, setUpdating] = useState<UpdatingState | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const filteredBookings = bookings.filter((entry) =>
    hasSearchQuery
      ? [entry.name, entry.email, entry.company ?? "", entry.focus]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearchQuery)
      : true,
  );
  const bookingStatusCounts = {
    new: bookings.filter((entry) => entry.status === "new").length,
    in_progress: bookings.filter((entry) => entry.status === "in_progress")
      .length,
    completed: bookings.filter((entry) => entry.status === "completed").length,
  };

  const updateStatus = async (id: string, nextStatus: SubmissionStatus) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setBookings((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
  };

  const deleteEntry = async (id: string) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setBookings((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="grid w-full min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24vw)] 2xl:grid-cols-[minmax(0,1fr)_minmax(20rem,26vw)] xl:items-start">
      <div className="grid min-w-0 gap-5">
        <AdminHeaderCard
          title="Bookings"
          action={
            <AdminSearchInput
              id="dashboard-bookings-search"
              label="Search"
              placeholder="Search contacts, households, organizations, or goals"
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

        {filteredBookings.length === 0 ? (
          <EmptyState
            label={
              hasSearchQuery
                ? `No booking requests match "${deferredSearchQuery.trim()}".`
                : "No NABU demo requests are waiting for review."
            }
          />
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((entry) => (
              <article
                key={entry.id}
                className="grid gap-5 rounded-[24px] border border-white/10 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] xl:grid-cols-[minmax(0,1fr)_minmax(15rem,20vw)] xl:items-start"
              >
                <div className="min-w-0 space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {entry.name}
                    </h2>
                    <p className="text-sm text-white/56">
                      {entry.email}
                      {entry.company ? ` | ${entry.company}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-white/44">
                    <span>{formatDate(entry.created_at)}</span>
                    <span>{formatPreferredDate(entry.preferred_date)}</span>
                    <span>{formatTimeLabel(entry.preferred_time)}</span>
                  </div>

                  <p className="max-w-4xl text-sm leading-7 text-white/74">
                    {entry.focus}
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

      <aside className="min-w-0 xl:sticky xl:top-5">
        <AdminSidePanel title="Booking Pipeline">
          <StatusCard
            label="New Bookings"
            value={bookingStatusCounts.new}
            accentClassName="bg-amber-200/90 shadow-[0_0_18px_rgba(253,230,138,0.35)]"
          />
          <StatusCard
            label="In Progress"
            value={bookingStatusCounts.in_progress}
            accentClassName="bg-sky-300/85 shadow-[0_0_18px_rgba(125,211,252,0.35)]"
          />
          <StatusCard
            label="Completed"
            value={bookingStatusCounts.completed}
            accentClassName="bg-emerald-300/85 shadow-[0_0_18px_rgba(110,231,183,0.35)]"
          />
        </AdminSidePanel>
      </aside>
    </div>
  );
}
