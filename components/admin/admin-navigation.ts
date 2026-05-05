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
    description: "See NABU demand, follow-up status, and quick admin shortcuts.",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: CalendarDays,
    description: "Review NABU demo requests and planned walkthroughs.",
  },
  {
    href: "/admin/contact",
    label: "Contact",
    icon: MessageSquareText,
    description: "Manage NABU questions, partner notes, and support needs.",
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    icon: Mail,
    description: "Track people waiting for NABU news and launch updates.",
  },
] satisfies AdminNavLink[];
