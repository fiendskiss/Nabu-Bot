"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import DotBackground from "@/components/bg/dot";
import BorderGlow from "@/components/BorderGlow";
import { InteractiveHoverButton } from "@/components/button/interactive-hover-button";
import { createClient } from "@/lib/supabase/client";
import { formatTimeLabel } from "@/lib/time";

export default function BookContent() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <DotBackground className="absolute inset-0 z-0 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.03),transparent_24%),radial-gradient(circle_at_75%_24%,rgba(168,85,247,0.03),transparent_22%),linear-gradient(180deg,rgba(5,5,5,0.12)_0%,rgba(5,5,5,0.24)_30%,rgba(5,5,5,0.38)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
          Book a Demo
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3.2rem] lg:text-[4.25rem]">
          See how the direction, the system, and the rollout can come together
          in one live walkthrough.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#D6DCF8]/72 sm:text-[1.1rem]">
          If you already have a concept, a launch target, or even just a rough
          brief, we can turn that into a focused demo conversation and map the
          next steps clearly.
        </p>

        <div className="mt-10 w-full max-w-[44rem]">
          <DemoBookingPanel />
        </div>
      </div>
    </section>
  );
}

function DemoBookingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const hasDateError = !selectedDate;
    const hasTimeError = !selectedTime;

    if (hasDateError || hasTimeError) {
      setShowDateError(hasDateError);
      setShowTimeError(hasTimeError);
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const focus = String(formData.get("focus") ?? "").trim();

    if (!name || !email || !focus) {
      setSubmitError("Please complete the required fields before submitting.");
      return;
    }

    setShowDateError(false);
    setShowTimeError(false);
    setSubmitError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      name,
      email,
      company: company || null,
      preferred_date: selectedDate,
      preferred_time: selectedTime,
      focus,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setIsSubmitted(true);
    form.reset();
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full justify-center"
    >
      {!isOpen ? (
        <motion.div
          key="closed"
          layoutId="book-demo-panel"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <InteractiveHoverButton
            type="button"
            onClick={() => setIsOpen(true)}
            className="border-white/12 bg-black px-7 py-3 text-base text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.4)] [&>div:first-child>div:first-child]:bg-[linear-gradient(135deg,#7C3AED_0%,#5E00FF_50%,#A855F7_100%)] [&>div:last-child]:text-white"
          >
            <span className="inline-flex items-center gap-2">
              Schedule a Demo
            </span>
          </InteractiveHoverButton>
        </motion.div>
      ) : (
        <motion.div
          key="open"
          layoutId="book-demo-panel"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <BorderGlow
            className="w-full rounded-[2rem] p-px"
            borderRadius={32}
            edgeSensitivity={22}
            glowRadius={24}
            glowIntensity={0.42}
            fillOpacity={0.12}
            backgroundColor="rgba(8,8,12,0.94)"
            colors={["#60A5FA", "#A855F7", "#38BDF8"]}
          >
            <div className="rounded-[calc(2rem-1px)] bg-[rgba(8,8,12,0.96)] px-6 py-6 text-left sm:px-8 sm:py-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/38">
                    Booking Form
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                    Tell us what the demo needs to cover.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
                    Share a few project details and we will have enough context
                    to shape a focused walkthrough.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsSubmitted(false);
                    setSelectedDate("");
                    setSelectedTime("");
                    setShowDateError(false);
                    setShowTimeError(false);
                  }}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/25 hover:text-white"
                >
                  Close
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-8 text-center"
                  >
                    <p className="text-sm uppercase tracking-[0.3em] text-[#A7B3FF]/58">
                      Request Sent
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                      Demo request received.
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/62">
                      We now have the basics we need. The next step would be to
                      confirm availability and shape the walkthrough around your
                      goals.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    onSubmit={handleSubmit}
                    className="mt-8 grid gap-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
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

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Field label="Company">
                        <input
                          name="company"
                          type="text"
                          placeholder="Studio or team"
                          className={inputClassName}
                        />
                      </Field>

                      <Field label="Preferred date">
                        <DatePickerField
                          value={selectedDate}
                          onChange={(value) => {
                            setSelectedDate(value);
                            setShowDateError(false);
                          }}
                          showError={showDateError}
                        />
                      </Field>

                      <Field label="Preferred time">
                        <TimeWheelField
                          value={selectedTime}
                          onChange={(value) => {
                            setSelectedTime(value);
                            setShowTimeError(false);
                          }}
                          showError={showTimeError}
                        />
                      </Field>
                    </div>

                    <Field label="What should the demo focus on?">
                      <textarea
                        required
                        name="focus"
                        rows={5}
                        placeholder="Tell us about the concept, the rollout, or the questions you want answered."
                        className={`${inputClassName} min-h-32 resize-none py-3`}
                      />
                    </Field>

                    <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                      <div className="max-w-xl">
                        <p className="text-xs leading-5 text-white/42">
                          Demo requests are now stored in Supabase so the admin
                          dashboard can track progress and follow-up.
                        </p>
                        {submitError ? (
                          <p className="mt-2 text-xs text-[#FCA5A5]">
                            {submitError}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full border border-white/12 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#EDEDED]"
                      >
                        {isSubmitting ? "Sending..." : "Send Request"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </BorderGlow>
        </motion.div>
      )}
    </motion.div>
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

function DatePickerField({
  value,
  onChange,
  showError,
}: {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (value) {
      return new Date(`${value}T00:00:00`);
    }

    return startOfMonth(new Date());
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const today = startOfDay(new Date());
  const firstDayOfMonth = startOfMonth(visibleMonth);
  const firstWeekday = firstDayOfMonth.getDay();
  const totalDays = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();

  const cells: Array<Date | null> = [];
  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day),
    );
  }

  const isPreviousDisabled =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (!isOpen && value) {
            setVisibleMonth(startOfMonth(new Date(`${value}T00:00:00`)));
          }

          setIsOpen((current) => !current);
        }}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white/[0.04] px-4 py-3 text-left text-sm text-white outline-none transition ${
          showError
            ? "border-[#F87171]/70"
            : "border-white/10 hover:border-white/22"
        }`}
      >
        <span className={value ? "text-white" : "text-white/32"}>
          {value ? formatDisplayDate(value) : "Select a date"}
        </span>
        <CalendarDays className="h-4 w-4 text-white/52" />
      </button>

      {showError ? (
        <p className="mt-2 text-xs text-[#FCA5A5]">Please choose a date.</p>
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-[calc(100%+0.75rem)] z-30 w-full min-w-[18rem] rounded-[22px] bg-[rgba(12,12,18,0.92)] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="rounded-[18px] border border-white/10 bg-[rgba(18,18,24,0.98)] px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isPreviousDisabled}
                  onClick={() =>
                    setVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <p className="text-sm font-semibold text-white">{monthLabel}</p>

                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.2em] text-white/34">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <span key={day} className="py-1">
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((date, index) => {
                  if (!date) {
                    return <span key={`empty-${index}`} className="h-10" />;
                  }

                  const normalized = startOfDay(date);
                  const isPast = normalized < today;
                  const dateValue = toInputDateValue(date);
                  const isSelected = value === dateValue;

                  return (
                    <button
                      key={dateValue}
                      type="button"
                      disabled={isPast}
                      onClick={() => {
                        setVisibleMonth(startOfMonth(date));
                        onChange(dateValue);
                        setIsOpen(false);
                      }}
                      className={`h-10 rounded-xl text-sm font-medium transition ${
                        isSelected
                          ? "bg-[linear-gradient(135deg,#60A5FA_0%,#7C3AED_52%,#A855F7_100%)] text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)]"
                          : isPast
                            ? "text-white/20"
                            : "border border-transparent bg-white/[0.03] text-white/72 hover:border-white/14 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TimeWheelField({
  value,
  onChange,
  showError,
}: {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftTime, setDraftTime] = useState(() => parseTimeWheelValue(value));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const updateDraftTime = (next: Partial<TimeWheelValue>) => {
    setDraftTime((current) => ({
      ...current,
      ...next,
    }));
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input type="hidden" name="preferredTime" value={value} />

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          if (!isOpen) {
            setDraftTime(parseTimeWheelValue(value));
          }

          setIsOpen((current) => !current);
        }}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white/[0.04] px-4 py-3 text-left text-sm text-white outline-none transition ${
          showError
            ? "border-[#F87171]/70"
            : "border-white/10 hover:border-white/22"
        }`}
      >
        <span className={value ? "text-white" : "text-white/32"}>
          {value ? formatDisplayTime(value) : "Select a time"}
        </span>
        <Clock className="h-4 w-4 text-white/52" />
      </button>

      {showError ? (
        <p className="mt-2 text-xs text-[#FCA5A5]">Please choose a time.</p>
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-full min-w-0 max-w-[15rem] rounded-[18px] bg-[rgba(12,12,18,0.92)] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="rounded-[14px] border border-white/10 bg-[rgba(18,18,24,0.98)] px-3 py-3">
              <div className="relative grid grid-cols-[1fr_1fr_0.9fr] gap-1.5 overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.03] p-1.5">
                <div className="pointer-events-none absolute left-1.5 right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg border border-white/10 bg-white/[0.055]" />
                <TimeWheelColumn
                  ariaLabel="Hour"
                  options={timeHours}
                  value={draftTime.hour}
                  renderOption={(option) => String(option)}
                  onSelect={(hour) => updateDraftTime({ hour })}
                />
                <TimeWheelColumn
                  ariaLabel="Minute"
                  options={timeMinutes}
                  value={draftTime.minute}
                  renderOption={(option) => String(option).padStart(2, "0")}
                  onSelect={(minute) => updateDraftTime({ minute })}
                />
                <TimeWheelColumn
                  ariaLabel="Period"
                  options={timePeriods}
                  value={draftTime.period}
                  renderOption={(option) => option}
                  onSelect={(period) => updateDraftTime({ period })}
                />
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onChange(toInputTimeValue(draftTime));
                    setIsOpen(false);
                  }}
                  className="rounded-full border border-white/12 bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:bg-[#EDEDED]"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TimeWheelColumn<T extends string | number>({
  ariaLabel,
  options,
  value,
  renderOption,
  onSelect,
}: {
  ariaLabel: string;
  options: T[];
  value: T;
  renderOption: (option: T) => string;
  onSelect: (option: T) => void;
}) {
  const dragStartRef = useRef<{
    index: number;
    pointerId: number;
    y: number;
  } | null>(null);
  const hasDraggedRef = useRef(false);
  const selectedIndex = Math.max(0, options.indexOf(value));
  const visibleOptions = Array.from({ length: 5 }, (_, index) => {
    const offset = index - 2;
    const optionIndex = wrapIndex(selectedIndex + offset, options.length);

    return {
      offset,
      option: options[optionIndex],
    };
  });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStartRef.current = {
      index: selectedIndex,
      pointerId: event.pointerId,
      y: event.clientY,
    };
    hasDraggedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!start) return;

    const delta = start.y - event.clientY;
    const steps = Math.trunc(delta / timeWheelRowHeight);
    if (steps === 0) return;

    hasDraggedRef.current = true;
    onSelect(options[wrapIndex(start.index + steps, options.length)]);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      dragStartRef.current = null;
      window.setTimeout(() => {
        hasDraggedRef.current = false;
      }, 0);
    }
  };

  return (
    <div
      aria-label={ariaLabel}
      className="relative z-10 grid h-32 touch-none select-none grid-rows-5"
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="listbox"
    >
      {visibleOptions.map(({ offset, option }) => {
        const isSelected = offset === 0;
        const opacityClass =
          Math.abs(offset) === 2
            ? "text-white/22"
            : Math.abs(offset) === 1
              ? "text-white/46"
              : "text-white";

        return (
          <button
            key={`${option}-${offset}`}
            type="button"
            aria-selected={isSelected}
            onClick={() => {
              if (!hasDraggedRef.current) {
                onSelect(option);
              }
            }}
            className={`flex h-full w-full items-center justify-center rounded-lg text-xs font-semibold transition ${
              isSelected
                ? "text-white"
                : `${opacityClass} hover:bg-white/[0.04] hover:text-white/72`
            }`}
            role="option"
          >
            {renderOption(option)}
          </button>
        );
      })}
    </div>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toInputDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

type TimeWheelValue = {
  hour: number;
  minute: number;
  period: "AM" | "PM";
};

const timeHours = Array.from({ length: 12 }, (_, index) => index + 1);
const timeMinutes = [0, 15, 30, 45];
const timePeriods: Array<TimeWheelValue["period"]> = ["AM", "PM"];
const timeWheelRowHeight = 26;

function parseTimeWheelValue(value: string): TimeWheelValue {
  if (!value) {
    return {
      hour: 9,
      minute: 0,
      period: "AM",
    };
  }

  const [rawHour, rawMinute] = value.split(":").map(Number);
  const hour24 = Number.isFinite(rawHour) ? rawHour : 9;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;

  return {
    hour,
    minute,
    period,
  };
}

function toInputTimeValue(time: TimeWheelValue) {
  const normalizedHour =
    time.period === "AM"
      ? time.hour === 12
        ? 0
        : time.hour
      : time.hour === 12
        ? 12
        : time.hour + 12;

  return `${String(normalizedHour).padStart(2, "0")}:${String(time.minute).padStart(
    2,
    "0",
  )}`;
}

function formatDisplayTime(value: string) {
  return formatTimeLabel(value);
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}
