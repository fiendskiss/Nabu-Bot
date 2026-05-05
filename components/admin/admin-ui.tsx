import Link from "next/link";
import { Search } from "lucide-react";
import {
  type SubmissionStatus,
} from "@/lib/submissions";
import SubmissionStatusSelect from "@/components/admin/submission-status-select";

export function AdminHeaderCard({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[9.25rem] w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.84),rgba(10,10,10,0.68))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-6">
      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/38">
            Admin Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-[2.6rem]">
            {title}
          </h1>
        </div>

        {action ? (
          <div className="w-full min-w-0 lg:w-[min(42vw,34rem)]">{action}</div>
        ) : null}
      </div>
    </section>
  );
}

export function AdminPanel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.84),rgba(10,10,10,0.68))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function AdminSidePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AdminPanel>
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/38">
            Summary
          </p>
          <h2 className="mt-3 text-[1.65rem] font-black tracking-[-0.04em] text-white">
            {title}
          </h2>
        </div>

        <div className="grid gap-4">{children}</div>
      </div>
    </AdminPanel>
  );
}

export function AdminSearchInput({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/42 lg:text-right"
      >
        {label}
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[20px] border border-white/12 bg-black/35 py-3 pl-11 pr-4 font-sans text-sm text-white placeholder:text-white/28 outline-none transition focus:border-white/28"
        />
      </div>
    </>
  );
}

export function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-h-[7rem] flex-col justify-between rounded-[22px] border border-white/10 bg-black/30 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-white/38">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
    </div>
  );
}

export function StatusCard({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: number;
  accentClassName: string;
}) {
  return (
    <div className="flex min-h-[7rem] flex-col justify-between rounded-[22px] border border-white/10 bg-black/30 p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full border border-white/15 ${accentClassName}`}
        />
        <p className="text-xs uppercase tracking-[0.26em] text-white/44">
          {label}
        </p>
      </div>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
    </div>
  );
}

export function QuickLinkCard({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[8.75rem] flex-col justify-between rounded-[22px] border border-white/10 bg-black/30 p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/78 transition group-hover:border-white/20 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.26em] text-white/36">
          Open
        </span>
      </div>

      <h2 className="text-xl font-semibold text-white">{label}</h2>
    </Link>
  );
}

export function SubmissionActions({
  value,
  isBusy,
  onStatusChange,
  onDelete,
  hideStatusControl = false,
}: {
  value: SubmissionStatus;
  isBusy: boolean;
  onStatusChange: (status: SubmissionStatus) => void;
  onDelete: () => void;
  hideStatusControl?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-stretch gap-3">
      {hideStatusControl ? null : (
        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/42">
            Progress
          </p>
          <SubmissionStatusSelect
            value={value}
            disabled={isBusy}
            onChange={onStatusChange}
          />
        </div>
      )}

      <button
        type="button"
        disabled={isBusy}
        onClick={onDelete}
        className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/16 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? "Working..." : "Delete"}
      </button>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/12 bg-black/20 p-6 text-sm text-white/56">
      {label}
    </div>
  );
}

export function formatDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatPreferredDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

export function formatStatusLabel(value: SubmissionStatus) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
