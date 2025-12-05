export const menuConfig = [
  {
    id: "dashboard",
    icon: "bx bx-home-alt",
    title: "Dashboards",
    route: "/dashboard",
    items: [
      { label: "Sales", icon: "bx bx-bar-chart", route: "/dashboard/sales" },
      { label: "Analytics", icon: "bx bx-pie-chart", route: "/dashboard/analytics" },
      { label: "Ecommerce", icon: "bx bx-cart", badge: 9, badgeColor: "Purple", route: "/dashboard/ecommerce" },
    ],
  },
  {
    id: "widgets",
    icon: "bx bx-grid-alt",
    title: "Widgets",
    route: "/widgets",
    items: [
      { label: "Statistics", icon: "bx bx-stats", route: "/widgets/statistics" },
      { label: "Charts", icon: "bx bx-line-chart", route: "/widgets/charts" },
    ],
  },
  {
    id: "analytics",
    icon: "bx bx-analyse",
    title: "Analytics",
    route: "/analytics",
    items: [
      { label: "User Analytics", icon: "bx bx-user", route: "/analytics/users" },
    ],
  },
];