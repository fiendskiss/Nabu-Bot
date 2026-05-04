import AdminOverview from "@/components/admin/admin-overview";
import {
  type BookingRecord,
  type ContactSubmissionRecord,
  type NewsletterSubmissionRecord,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
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
    <AdminOverview
      bookings={bookings}
      contacts={contacts}
      newsletters={newsletters}
    />
  );
}
