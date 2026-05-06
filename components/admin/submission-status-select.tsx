"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  formatStatusLabel,
  getStatusAccentClassName,
  submissionStatuses,
  type SubmissionStatus,
} from "@/lib/submissions";

export default function SubmissionStatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: SubmissionStatus;
  disabled: boolean;
  onChange: (status: SubmissionStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const statusAccentClassName = getStatusAccentClassName(value);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center rounded-[18px] border border-white/12 bg-black/35 px-4 py-3 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-white outline-none transition hover:border-white/20 focus:border-white/32 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full border border-white/18 ${statusAccentClassName}`}
          />
          <span>{formatStatusLabel(value)}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`ml-3 h-4 w-4 shrink-0 text-white/48 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label="Submission status"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-[20px] border border-white/10 bg-[#111111] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="grid gap-1">
            {submissionStatuses.map((status) => {
              const isSelected = status === value;

              return (
                <button
                  key={status}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setIsOpen(false);
                    onChange(status);
                  }}
                  className={`flex w-full items-center rounded-[14px] px-3 py-2.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.2em] transition ${
                    isSelected
                      ? "bg-white/[0.08] text-white"
                      : "text-white/72 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3 text-left">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 rounded-full border border-white/18 ${getStatusAccentClassName(
                        status,
                      )}`}
                    />
                    <span>{formatStatusLabel(status)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
