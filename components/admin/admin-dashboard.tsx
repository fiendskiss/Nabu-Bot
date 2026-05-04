"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Home,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareText,
  X,
  Search,
  type LucideIcon,
} from "lucide-react";
import {
  type BookingRecord,
  type ContactSubmissionRecord,
  type NewsletterSubmissionRecord,
  type SubmissionStatus,
  submissionStatuses,
} from "@/lib/submissions";
import AdminSignOutButton from "@/components/admin/admin-sign-out-button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/time";

type AdminDashboardProps = {
  initialBookings: BookingRecord[];
  initialContacts: ContactSubmissionRecord[];
  initialNewsletters: NewsletterSubmissionRecord[];
};

type UpdatingState = {
  id: string;
  action: "status" | "delete";
};

type SectionLink = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
};

const dashboardSidebarLinks = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: CalendarDays,
  },
  {
    id: "contacts",
    label: "Contact Submissions",
    icon: MessageSquareText,
  },
  {
    id: "newsletters",
    label: "Newsletter",
    icon: Mail,
  },
] satisfies SectionLink[];

const dashboardSectionIds = dashboardSidebarLinks
  .filter((link) => !link.href)
  .map((link) => link.id);

export default function AdminDashboard({
  initialBookings,
  initialContacts,
  initialNewsletters,
}: AdminDashboardProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [contacts, setContacts] = useState(initialContacts);
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [updating, setUpdating] = useState<UpdatingState | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const supabase = createClient();
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const filteredBookings = bookings.filter((entry) =>
    hasSearchQuery
      ? entry.name.toLowerCase().includes(normalizedSearchQuery)
      : true,
  );
  const filteredContacts = contacts.filter((entry) =>
    hasSearchQuery
      ? entry.name.toLowerCase().includes(normalizedSearchQuery)
      : true,
  );
  const filteredNewsletters = newsletters.filter((entry) =>
    hasSearchQuery
      ? entry.email.toLowerCase().includes(normalizedSearchQuery)
      : true,
  );
  const bookingStatusCounts = {
    new: bookings.filter((entry) => entry.status === "new").length,
    in_progress: bookings.filter((entry) => entry.status === "in_progress")
      .length,
    completed: bookings.filter((entry) => entry.status === "completed").length,
  } satisfies Record<SubmissionStatus, number>;

  useEffect(() => {
    const syncActiveSectionFromHash = () => {
      const sectionFromHash = window.location.hash.replace("#", "");

      if (dashboardSectionIds.includes(sectionFromHash)) {
        setActiveSection(sectionFromHash);
      }
    };

    syncActiveSectionFromHash();

    const sections = dashboardSectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (entryA, entryB) =>
              entryB.intersectionRatio - entryA.intersectionRatio,
          )[0];

        if (visibleSection?.target.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-24% 0px -52% 0px",
        threshold: [0.2, 0.35, 0.55],
      },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("hashchange", syncActiveSectionFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncActiveSectionFromHash);
    };
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  const updateStatus = async (
    table: "bookings" | "contact_submissions" | "newsletter_submissions",
    id: string,
    nextStatus: SubmissionStatus,
  ) => {
    setUpdating({ id, action: "status" });
    setErrorMessage("");

    const { error } = await supabase
      .from(table)
      .update({ status: nextStatus })
      .eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (table === "bookings") {
      setBookings((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, status: nextStatus } : entry,
        ),
      );
      return;
    }

    if (table === "contact_submissions") {
      setContacts((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, status: nextStatus } : entry,
        ),
      );
      return;
    }

    setNewsletters((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status: nextStatus } : entry,
      ),
    );
  };

  const deleteEntry = async (
    table: "bookings" | "contact_submissions" | "newsletter_submissions",
    id: string,
  ) => {
    setUpdating({ id, action: "delete" });
    setErrorMessage("");

    const { error } = await supabase.from(table).delete().eq("id", id);

    setUpdating(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (table === "bookings") {
      setBookings((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    if (table === "contact_submissions") {
      setContacts((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    setNewsletters((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)] lg:items-start">
      <DashboardSidebar
        links={dashboardSidebarLinks}
        activeSection={activeSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSectionSelect={setActiveSection}
      />

      <div className="grid gap-8">
        <DashboardTopbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <SectionCard
          id="overview"
          title="Overview"
          description="The dashboard opens here first so you can see pipeline health, totals, and booking progress immediately."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard label="Bookings" value={bookings.length} />
              <SummaryCard label="Contacts" value={contacts.length} />
              <SummaryCard label="Newsletter" value={newsletters.length} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatusCard
                label="New"
                value={bookingStatusCounts.new}
                accentClassName="bg-amber-200/90 shadow-[0_0_18px_rgba(253,230,138,0.35)]"
              />
              <StatusCard
                label="In Progress"
                value={bookingStatusCounts.in_progress}
                accentClassName="bg-sky-300/85 shadow-[0_0_18px_rgba(125,211,252,0.35)]"
              />
              <StatusCard
                label="Completed"
                value={bookingStatusCounts.completed}
                accentClassName="bg-emerald-300/85 shadow-[0_0_18px_rgba(110,231,183,0.35)]"
              />
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/66">
            {hasSearchQuery ? (
              <span>
                Showing matches for{" "}
                <span className="font-semibold text-white">
                  &quot;{searchQuery.trim()}&quot;
                </span>
                .
              </span>
            ) : (
              <span>
                Use the left sidebar to jump sections, and the top-right search
                to find names or emails quickly.
              </span>
            )}
          </div>

          {errorMessage ? (
            <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>
          ) : null}
        </SectionCard>

        <SectionCard
          id="bookings"
          title="Bookings"
          description="Demo requests from the public booking form."
        >
          {filteredBookings.length === 0 ? (
            <EmptyState
              label={
                hasSearchQuery
                  ? `No booking requests match "${searchQuery.trim()}".`
                  : "No booking requests yet."
              }
            />
          ) : (
            <div className="grid gap-4">
              {filteredBookings.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[24px] border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {entry.name}
                        </h3>
                        <p className="text-sm text-white/56">
                          {entry.email}
                          {entry.company ? ` | ${entry.company}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-white/44">
                        <span>{formatDate(entry.created_at)}</span>
                        <span>{formatPreferredDate(entry.preferred_date)}</span>
                        <span>{formatPreferredTime(entry.preferred_time)}</span>
                      </div>

                      <p className="max-w-3xl text-sm leading-7 text-white/74">
                        {entry.focus}
                      </p>
                    </div>

                    <Actions
                      value={entry.status}
                      isBusy={updating?.id === entry.id}
                      onDelete={() => deleteEntry("bookings", entry.id)}
                      onStatusChange={(status) =>
                        updateStatus("bookings", entry.id, status)
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          id="contacts"
          title="Contact Submissions"
          description="Messages sent from the contact page."
        >
          {filteredContacts.length === 0 ? (
            <EmptyState
              label={
                hasSearchQuery
                  ? `No contact submissions match "${searchQuery.trim()}".`
                  : "No contact messages yet."
              }
            />
          ) : (
            <div className="grid gap-4">
              {filteredContacts.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[24px] border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {entry.name}
                        </h3>
                        <p className="text-sm text-white/56">
                          {entry.email}
                          {entry.company ? ` | ${entry.company}` : ""}
                          {entry.subject ? ` | ${entry.subject}` : ""}
                        </p>
                      </div>

                      <div className="text-xs uppercase tracking-[0.24em] text-white/44">
                        {formatDate(entry.created_at)}
                      </div>

                      <p className="max-w-3xl text-sm leading-7 text-white/74">
                        {entry.message}
                      </p>
                    </div>

                    <Actions
                      value={entry.status}
                      isBusy={updating?.id === entry.id}
                      onDelete={() =>
                        deleteEntry("contact_submissions", entry.id)
                      }
                      onStatusChange={(status) =>
                        updateStatus("contact_submissions", entry.id, status)
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          id="newsletters"
          title="Newsletter"
          description="Emails collected from the footer subscription flow."
        >
          {filteredNewsletters.length === 0 ? (
            <EmptyState
              label={
                hasSearchQuery
                  ? `No newsletter submissions match "${searchQuery.trim()}".`
                  : "No newsletter subscribers yet."
              }
            />
          ) : (
            <div className="grid gap-4">
              {filteredNewsletters.map((entry) => (
                <article
                  key={entry.id}
                  className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/30 p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {entry.email}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/44">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>

                  <Actions
                    value={entry.status}
                    isBusy={updating?.id === entry.id}
                    onDelete={() =>
                      deleteEntry("newsletter_submissions", entry.id)
                    }
                    onStatusChange={(status) =>
                      updateStatus("newsletter_submissions", entry.id, status)
                    }
                  />
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function DashboardTopbar({
  searchQuery,
  onSearchQueryChange,
  onOpenSidebar,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenSidebar: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.84),rgba(10,10,10,0.68))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/78 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Open dashboard menu"
            aria-controls="dashboard-sidebar-menu"
            aria-expanded={false}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">
              Admin Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-[2.7rem]">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
              Search records quickly and jump between sections from the
              sidebar.
            </p>
          </div>
        </div>

        <div className="w-full lg:max-w-sm">
          <label
            htmlFor="dashboard-search"
            className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/42 lg:text-right"
          >
            Search
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36"
            />
            <input
              id="dashboard-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search names or emails"
              className="w-full rounded-[20px] border border-white/12 bg-black/35 py-3 pl-11 pr-4 font-sans text-sm text-white placeholder:text-white/28 outline-none transition focus:border-white/28"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSidebar({
  links,
  activeSection,
  isOpen,
  onClose,
  onSectionSelect,
}: {
  links: SectionLink[];
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
  onSectionSelect: (sectionId: string) => void;
}) {
  return (
    <>
      <aside className="hidden lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)]">
        <SidebarPanel
          links={links}
          activeSection={activeSection}
          onClose={onClose}
          onSectionSelect={onSectionSelect}
        />
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={onClose}
            className="absolute inset-0 bg-black/72 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-sidebar-heading"
            className="relative h-full w-[min(84vw,320px)] p-4"
          >
            <SidebarPanel
              links={links}
              activeSection={activeSection}
              isMobile
              onClose={onClose}
              onSectionSelect={onSectionSelect}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function SidebarPanel({
  links,
  activeSection,
  isMobile = false,
  onClose,
  onSectionSelect,
}: {
  links: SectionLink[];
  activeSection: string;
  isMobile?: boolean;
  onClose: () => void;
  onSectionSelect: (sectionId: string) => void;
}) {
  return (
    <div
      id={isMobile ? "dashboard-sidebar-menu" : undefined}
      className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.94),rgba(10,10,10,0.78))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/38">
            Menu
          </p>
          <h2
            id={isMobile ? "dashboard-sidebar-heading" : undefined}
            className="mt-3 text-2xl font-black tracking-[-0.04em] text-white"
          >
            Dashboard
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Jump between sections, search records, and manage submissions from
            one place.
          </p>
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/78 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            aria-label="Close dashboard menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav className="mt-6 grid gap-2">
        {links.map((link) => {
          const isActive = !link.href && activeSection === link.id;

          if (link.href) {
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-[18px] border border-transparent px-3 py-3 text-sm font-semibold text-white/70 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
              >
                <link.icon className="h-4 w-4 text-white/45 transition group-hover:text-white/75" />
                <span>{link.label}</span>
              </Link>
            );
          }

          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => {
                onSectionSelect(link.id);
                onClose();
              }}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-[18px] border border-transparent px-3 py-3 text-sm font-semibold text-white/70 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
                isActive &&
                  "border-white/10 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
              )}
            >
              <link.icon
                className={cn(
                  "h-4 w-4 text-white/45 transition group-hover:text-white/75",
                  isActive && "text-white/80",
                )}
              />
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <AdminSignOutButton className="w-full rounded-[18px] border-white/10 bg-white/[0.04] px-3 py-3 text-left text-sm font-semibold text-white/80 hover:border-white/20 hover:bg-white/[0.08] hover:text-white" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/38">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: number;
  accentClassName: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full border border-white/15 ${accentClassName}`}
        />
        <p className="text-xs uppercase tracking-[0.26em] text-white/44">
          {label}
        </p>
      </div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.84),rgba(10,10,10,0.68))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-white/38">
          Dashboard Section
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/62">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Actions({
  value,
  isBusy,
  onStatusChange,
  onDelete,
}: {
  value: SubmissionStatus;
  isBusy: boolean;
  onStatusChange: (status: SubmissionStatus) => void;
  onDelete: () => void;
}) {
  const statusAccentClassName = getStatusAccentClassName(value);

  return (
    <div className="flex flex-col items-stretch gap-3 lg:min-w-44">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/42">
          Progress
        </p>
        <div className="relative">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/18 ${statusAccentClassName}`}
          />
          <select
            value={value}
            disabled={isBusy}
            onChange={(event) =>
              onStatusChange(event.target.value as SubmissionStatus)
            }
            className="w-full appearance-none rounded-[18px] border border-white/12 bg-black/35 py-3 pl-9 pr-11 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-white outline-none transition hover:border-white/20 focus:border-white/32 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submissionStatuses.map((status) => (
              <option
                key={status}
                value={status}
                className="bg-[#050505] font-sans"
              >
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/48"
          />
        </div>
      </div>

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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/12 bg-black/20 p-6 text-sm text-white/56">
      {label}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPreferredDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatPreferredTime(value: string) {
  return formatTimeLabel(value);
}

function formatStatusLabel(value: SubmissionStatus) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusAccentClassName(value: SubmissionStatus) {
  switch (value) {
    case "completed":
      return "bg-emerald-300/85 shadow-[0_0_18px_rgba(110,231,183,0.45)]";
    case "in_progress":
      return "bg-sky-300/85 shadow-[0_0_18px_rgba(125,211,252,0.45)]";
    default:
      return "bg-amber-200/90 shadow-[0_0_18px_rgba(253,230,138,0.42)]";
  }
}
