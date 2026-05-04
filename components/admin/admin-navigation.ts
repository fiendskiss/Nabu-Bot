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
  description: string;
};

export const adminSidebarLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    description: "Return to the main website.",
  },
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    description: "See totals, pipeline health, and quick admin shortcuts.",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: CalendarDays,
    description: "Review demo and booking requests from the public form.",
  },
  {
    href: "/admin/contact",
    label: "Contact",
    icon: MessageSquareText,
    description: "Read and manage messages sent from the contact page.",
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    icon: Mail,
    description: "Manage email signups collected from the site footer.",
  },
] satisfies AdminNavLink[];
