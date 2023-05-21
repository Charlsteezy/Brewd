import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "My posts",
      href: "/dashboard",
    },
    {
      title: "Browser",
      href: "/dashboard/browser",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
    },
  ],
  sidebarNav: [
    {
      title: "My posts",
      href: "/dashboard",
      icon: "coffee",
    },
    {
      title: "Browser",
      href: "/dashboard/browser",
      icon: "browser",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
