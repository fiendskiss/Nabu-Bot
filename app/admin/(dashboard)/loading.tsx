export default function AdminDashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)] lg:items-start">
      <div className="hidden h-[calc(100vh-3rem)] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04] lg:block" />

      <div className="grid gap-6">
        <div className="h-14 w-14 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] lg:hidden" />
        <div className="animate-pulse rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
          <div className="h-4 w-28 rounded-full bg-white/[0.08]" />
          <div className="mt-4 h-12 w-56 rounded-full bg-white/[0.08]" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-white/[0.06]" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="h-32 rounded-[24px] bg-white/[0.05]" />
            <div className="h-32 rounded-[24px] bg-white/[0.05]" />
            <div className="h-32 rounded-[24px] bg-white/[0.05]" />
          </div>
        </div>
      </div>
    </div>
  );
}
