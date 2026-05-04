import AdminContactPage from "@/components/admin/admin-contact-page";
import { type ContactSubmissionRecord } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminContactRoute() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminContactPage
      initialContacts={(data ?? []) as ContactSubmissionRecord[]}
    />
  );
}
