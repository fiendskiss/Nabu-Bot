"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { PanelLeft } from "lucide-react";
import {
  adminSidebarLinks,
  type AdminNavLink,
} from "@/components/admin/admin-navigation";
import AdminSignOutButton from "@/components/admin/admin-sign-out-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      <SidebarProvider
        open
        style={
          {
            "--sidebar-width": "12rem",
            "--sidebar-width-icon": "2.75rem",
          } as CSSProperties
        }
      >
        <AdminShellLayout>{children}</AdminShellLayout>
      </SidebarProvider>
    </div>
  );
}

function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <div className="flex min-h-svh bg-[#050505] text-white">
      {isMobile ? (
        <Sidebar
          variant="sidebar"
          collapsible="offcanvas"
          className="dark border-white/10 bg-[#161616] text-white shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          <AdminSidebar links={adminSidebarLinks} />
        </Sidebar>
      ) : null}

      <aside
        className="hidden min-h-svh w-[12rem] shrink-0 flex-col border-r border-white/10 bg-[#161616] md:flex"
      >
        <AdminSidebar links={adminSidebarLinks} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-black/70 px-4 backdrop-blur-xl md:hidden">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/78 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/48">
            Admin
          </p>
        </header>

        <main className="flex w-full min-w-0 flex-1 flex-col items-stretch gap-5 px-4 py-4 md:px-5 md:py-5">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({
  links,
}: {
  links: AdminNavLink[];
}) {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-5">
        <p className="px-2 text-sm font-medium text-white/72">
          Nabu Dashboard
        </p>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <AdminSidebarLink
                    link={link}
                    isActive={pathname === link.href}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="border-t border-sidebar-border/70 px-3 py-3"
      >
        <AdminSignOutButton className="w-full rounded-2xl border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-sm font-semibold text-white/80 hover:border-white/20 hover:bg-white/[0.08] hover:text-white" />
      </SidebarFooter>
    </>
  );
}

function AdminSidebarLink({
  link,
  isActive,
}: {
  link: AdminNavLink;
  isActive: boolean;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      size="lg"
      tooltip={link.label}
      className={cn(
        "h-10 rounded-[14px] border border-transparent px-3 py-2 text-white/70 transition",
        "hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
        isActive &&
          "border-white/10 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
      )}
    >
      <Link
        href={link.href}
        className="flex w-full items-center gap-2 justify-start"
        onClick={() => {
          if (isMobile) {
            setOpenMobile(false);
          }
        }}
      >
        <link.icon
          className={cn(
            "h-4 w-4 text-white/45 transition group-hover/menu-item:text-white/75",
            isActive && "text-white/80",
          )}
        />
        <span className="block overflow-hidden whitespace-nowrap text-sm font-medium">
          {link.label}
        </span>
      </Link>
    </SidebarMenuButton>
  );
}
