"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminAuthButton() {
  const [href, setHref] = useState("/admin/sign-in");
  const [label, setLabel] = useState("Admin Sign In");

  useEffect(() => {
    const supabase = createClient();

    const syncUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setHref("/admin");
        setLabel("Dashboard");
        return;
      }

      setHref("/admin/sign-in");
      setLabel("Admin Sign In");
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Link
      href={href}
      className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}
