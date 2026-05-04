"use client";

import { FormEvent, useState } from "react";
import { CosmicSpectrum } from "@/components/cosmos-spectrum";
import { createClient } from "@/lib/supabase/client";

export default function ContactSpectrumSection() {
  return (
    <div className="bg-[#050505]">
      <CosmicSpectrum
        color="original"
        blur={false}
        scoped
        heroContent={<ContactHeroContent />}
        mainContent={<ContactFormCard />}
        spacerClassName="h-[20vh]"
        mainContentPositionClassName="bottom-[14vh] sm:bottom-[16vh] lg:bottom-[18vh]"
      />
    </div>
  );
}

function ContactHeroContent() {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500">
        Contact NABU
      </p>
      <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3.2rem] lg:text-[4.25rem]">
        Contact the team about NABU, demos, setup, or support.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl px-8 text-center text-base leading-7 text-zinc-400 sm:text-[1.1rem]">
        Send your questions about the home companion robot, private demos,
        household routines, safety expectations, or how NABU could work in your
        space.
      </p>
    </div>
  );
}

function ContactFormCard() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitError("Please complete the required fields before submitting.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      company: company || null,
      subject: subject || null,
      message,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setIsSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="mx-auto w-[min(92vw,42rem)] rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(10,10,10,0.84),rgba(10,10,10,0.72))] p-5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-6">
      {isSubmitted ? (
        <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/46">
            Message Sent
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
            Thanks for reaching out.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/62">
            Your message has been received. We now have the context we need to
            follow up and continue the conversation.
          </p>
        </div>
      ) : (
        <>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/38">
              Contact Form
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
              Share your NABU question or request.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
              A few details help the team understand whether you need demo
              guidance, setup information, feature context, or support.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-3.5">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Name">
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className={inputClassName}
                />
              </Field>

              <Field label="Email">
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Company">
                <input
                  name="company"
                  type="text"
                  placeholder="Household, team, or organization"
                  className={inputClassName}
                />
              </Field>

              <Field label="Subject">
                <input
                  name="subject"
                  type="text"
                  placeholder="Demo, setup, support, or general question"
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="Message">
              <textarea
                required
                name="message"
                rows={4}
                placeholder="Tell us what you want to know about NABU, your home context, or the support you need."
                className={`${inputClassName} min-h-28 resize-none py-3`}
              />
            </Field>

            <div className="flex flex-col items-start justify-between gap-3.5 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="text-xs leading-5 text-white/42">
                  Messages are saved so the NABU team can track replies and
                  follow up with the right context.
                </p>
                {submitError ? (
                  <p className="mt-2 text-xs text-[#FCA5A5]">{submitError}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full border border-white/12 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#EDEDED]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/72">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/28 focus:bg-white/[0.06]";
