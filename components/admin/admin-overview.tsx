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
  const bookingStatusCounts = {
    new: bookings.filter((entry) => entry.status === "new").length,
    in_progress: bookings.filter((entry) => entry.status === "in_progress")
      .length,
    completed: bookings.filter((entry) => entry.status === "completed").length,
  };

  return (
    <div className="grid gap-6">
      <AdminHeaderCard
        title="Overview"
        description="Your dashboard menu is now a true sidebar, and each admin area opens as its own page for faster navigation."
      />

      <AdminPanel>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <SummaryCard label="Bookings" value={bookings.length} />
          <SummaryCard label="Contacts" value={contacts.length} />
          <SummaryCard label="Newsletter" value={newsletters.length} />
          <StatusCard
            label="New"
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
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/66">
          Use the sidebar to move between pages, or jump directly into the
          sections below to manage incoming submissions.
        </div>
      </AdminPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSidebarLinks
          .filter((link) => link.href.startsWith("/admin/"))
          .map((link) => {
            const count =
              link.href === "/admin/bookings"
                ? bookings.length
                : link.href === "/admin/contact"
                  ? contacts.length
                  : link.href === "/admin/newsletter"
                    ? newsletters.length
                    : bookings.length + contacts.length + newsletters.length;

            return (
              <QuickLinkCard
                key={link.href}
                href={link.href}
                label={link.label}
                description={link.description}
                icon={link.icon}
                count={count}
              />
            );
          })}
      </div>
    </div>
  );
}
