import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
  ],
  sidebarNav: [
    {
      title: "My posts",
      href: "/dashboard",
      icon: "coffee",
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
