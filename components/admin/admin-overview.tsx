import { adminSidebarLinks } from "@/components/admin/admin-navigation";
import {
  AdminHeaderCard,
  AdminPanel,
  QuickLinkCard,
  StatusCard,
  SummaryCard,
} from "@/components/admin/admin-ui";
import {
  type BookingRecord,
  type ContactSubmissionRecord,
  type NewsletterSubmissionRecord,
} from "@/lib/submissions";

export default function AdminOverview({
  bookings,
  contacts,
  newsletters,
}: {
  bookings: BookingRecord[];
  contacts: ContactSubmissionRecord[];
  newsletters: NewsletterSubmissionRecord[];
}) {
  const allSubmissions = [...bookings, ...contacts, ...newsletters];
  const totalStatusCounts = {
    new: allSubmissions.filter((entry) => entry.status === "new").length,
    in_progress: allSubmissions.filter(
      (entry) => entry.status === "in_progress",
    ).length,
    completed: allSubmissions.filter((entry) => entry.status === "completed")
      .length,
  };

  return (
    <div className="grid w-full min-w-0 gap-5">
      <AdminHeaderCard title="Overview" />

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel>
          <OverviewGroupTitle label="Total Numbers" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <SummaryCard label="All Submissions" value={allSubmissions.length} />
            <SummaryCard label="Bookings" value={bookings.length} />
            <SummaryCard label="Contacts" value={contacts.length} />
            <SummaryCard label="Newsletter" value={newsletters.length} />
          </div>
        </AdminPanel>

        <AdminPanel>
          <OverviewGroupTitle label="Total Progress" />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
        </AdminPanel>
      </div>

      <AdminPanel>
        <OverviewGroupTitle label="Quick Access" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {adminSidebarLinks
            .filter((link) => link.href.startsWith("/admin/"))
            .map((link) => (
              <QuickLinkCard
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
              />
            ))}
        </div>
      </AdminPanel>
    </div>
  );
}

function OverviewGroupTitle({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-white/42">
      {label}
    </h2>
  );
}
