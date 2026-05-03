import { redirect } from "next/navigation";
import AdminSignInCard from "@/components/admin/admin-sign-in-card";
import Navbar from "@/components/navbar/Navbar";
import { adminEmail, isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSignInPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminEmail(user?.email)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505]">
      <Navbar />
      <section className="flex min-h-screen items-center justify-center px-6 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-32">
        <AdminSignInCard adminEmail={adminEmail} signedInEmail={user?.email} />
      </section>
    </main>
  );
}
