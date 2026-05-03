import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminSignOutButton from "@/components/admin/admin-sign-out-button";
import Navbar from "@/components/navbar/Navbar";
import {
  type BookingRecord,
  type ContactSubmissionRecord,
  type NewsletterSubmissionRecord,
} from "@/lib/submissions";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/sign-in");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/admin/sign-in");
  }

  const [bookingsResult, contactsResult, newslettersResult] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("newsletter_submissions")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const bookings = (bookingsResult.data ?? []) as BookingRecord[];
  const contacts = (contactsResult.data ?? []) as ContactSubmissionRecord[];
  const newsletters = (newslettersResult.data ?? []) as NewsletterSubmissionRecord[];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505]">
      <Navbar />
      <section className="px-6 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                Admin Dashboard
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-[3.2rem]">
                Manage bookings, contact messages, and newsletter leads.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#D6DCF8]/72">
                Review incoming requests, update progress as the team responds,
                and clean up entries when they are no longer needed.
              </p>
            </div>

            <AdminSignOutButton />
          </div>

          <AdminDashboard
            initialBookings={bookings}
            initialContacts={contacts}
            initialNewsletters={newsletters}
          />
        </div>
      </section>
    </main>
  );
}
