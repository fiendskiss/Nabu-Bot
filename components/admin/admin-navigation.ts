import {
  CalendarDays,
  Home,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

export type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminSidebarLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: CalendarDays,
  },
  {
    href: "/admin/contact",
    label: "Contact",
    icon: MessageSquareText,
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    icon: Mail,
  },
] satisfies AdminNavLink[];
