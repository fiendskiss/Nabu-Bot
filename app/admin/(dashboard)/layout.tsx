import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin/sign-in");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505]">
      <AdminShell>{children}</AdminShell>
    </main>
  );
}
