"use client";

import { FormEvent, useState } from "react";
import { CosmicSpectrum } from "@/components/cosmos-spectrum";

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
      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
        Contact Us
      </p>
      <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
        Start the conversation and tell us what you are building next.
      </h1>
      <p className="mt-4 max-w-2xl px-8 text-center text-neutral-300 mx-auto">
        Whether you need a campaign direction, a launch-ready interface, or a
        clearer system for the work ahead, send the essentials and we will help
        shape the next step.
      </p>
    </div>
  );
}

function ContactFormCard() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
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
              Share the brief, the goal, or the question.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
              A few key details are enough for us to understand where the work
              is headed and how we can help.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-3.5">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Name">
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className={inputClassName}
                />
              </Field>

              <Field label="Email">
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Company">
                <input
                  type="text"
                  placeholder="Studio or team"
                  className={inputClassName}
                />
              </Field>

              <Field label="Subject">
                <input
                  type="text"
                  placeholder="What is this about?"
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="Message">
              <textarea
                required
                rows={4}
                placeholder="Tell us about the project, timeline, or what you want to discuss."
                className={`${inputClassName} min-h-28 resize-none py-3`}
              />
            </Field>

            <div className="flex flex-col items-start justify-between gap-3.5 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
              <p className="max-w-xl text-xs leading-5 text-white/42">
                This form currently shows a front-end success state after
                submission.
              </p>

              <button
                type="submit"
                className="rounded-full border border-white/12 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#EDEDED]"
              >
                Send Message
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
