import AdminNewsletterPage from "@/components/admin/admin-newsletter-page";
import { type NewsletterSubmissionRecord } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNewsletterRoute() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("newsletter_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    return (
      <AdminNewsletterPage
        initialNewsletters={(data ?? []) as NewsletterSubmissionRecord[]}
        initialErrorMessage={error?.message ?? ""}
      />
    );
  } catch {
    return (
      <AdminNewsletterPage
        initialNewsletters={[]}
        initialErrorMessage="Unable to load newsletter submissions right now."
      />
    );
  }
}
