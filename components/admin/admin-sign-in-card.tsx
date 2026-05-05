"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AdminSignInCardProps = {
  adminEmail: string;
  signedInEmail?: string | null;
};

export default function AdminSignInCard({
  adminEmail,
  signedInEmail,
}: AdminSignInCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isUnauthorized = useMemo(
    () => Boolean(signedInEmail && signedInEmail.toLowerCase() !== adminEmail.toLowerCase()),
    [adminEmail, signedInEmail],
  );

  const handleSendMagicLink = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setMessage("");

    const supabase = createClient();
    const redirectUrl = `${window.location.origin}/auth/confirm`;
    const { error } = await supabase.auth.signInWithOtp({
      email: adminEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Magic link sent. Open the email on the admin inbox to continue.");
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const hasAuthError = searchParams.get("error") === "auth";

  return (
    <div className="w-full max-w-xl rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(10,10,10,0.88),rgba(10,10,10,0.72))] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8">
      <p className="text-xs uppercase tracking-[0.35em] text-white/40">
        Admin Access
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
        Secure dashboard sign in
      </h1>
      <p className="mt-4 text-sm leading-7 text-white/68">
        Only the configured admin account can access the dashboard. This sign-in
        sends a magic link to the approved inbox.
      </p>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-white/36">
          Authorized Admin
        </p>
        <p className="mt-3 break-all text-lg font-semibold text-white">
          {adminEmail}
        </p>
      </div>

      {isUnauthorized ? (
        <div className="mt-6 rounded-[24px] border border-amber-400/20 bg-amber-400/8 p-5">
          <p className="text-sm font-semibold text-amber-100">
            {signedInEmail} is signed in, but it is not the authorized admin account.
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-50/75">
            Sign out of that session first, then send a magic link to the
            approved admin email above.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 rounded-full border border-amber-100/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSendMagicLink}
          disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#5E00FF_0%,#7C3AED_50%,#38BDF8_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(94,0,255,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending magic link..." : "Send Magic Link"}
        </button>
      )}

      {message ? (
        <p className="mt-4 text-sm text-emerald-300">{message}</p>
      ) : null}

      {hasAuthError ? (
        <p className="mt-4 text-sm text-rose-300">
          The sign-in link could not be verified. Try sending a fresh magic link.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>
      ) : null}

      <p className="mt-6 text-xs leading-6 text-white/38">
        In Supabase, add this production callback to Redirect URLs and make the
        magic-link template send token_hash to the redirect target.
      </p>
    </div>
  );
}
