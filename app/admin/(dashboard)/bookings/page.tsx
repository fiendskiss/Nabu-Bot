import AdminBookingsPage from "@/components/admin/admin-bookings-page";
import { type BookingRecord } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBookingsRoute() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminBookingsPage initialBookings={(data ?? []) as BookingRecord[]} />;
}
