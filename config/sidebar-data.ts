import { SidebarData } from "@/types";
import {
  RiDashboardLine,
  RiShoppingCart2Line,
  RiBox3Line,
  RiPriceTag3Line,
  RiUser3Line,
  RiTruckLine,
  RiFileList3Line,
  RiBarChartLine,
  RiUserSettingsLine,
  RiSettings3Line,
  RiUserLine,
  RiUploadCloud2Line,
  RiShieldCheckLine,
} from "@remixicon/react";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "DutaShop",
      logo: RiShoppingCart2Line,
      plan: "v1.0.0",
    },
  ],

  navGroups: [
    // ======================
    // GENERAL
    // ======================
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: RiDashboardLine,
        },
        {
          title: "Kasir",
          url: "/pos",
          icon: RiShoppingCart2Line,
        },
      ],
    },

    // ======================
    // MASTER DATA
    // ======================
    {
      title: "Master Data",
      items: [
        {
          title: "Produk",
          url: "/products",
          icon: RiBox3Line,
        },
        {
          title: "Kategori",
          url: "/categories",
          icon: RiPriceTag3Line,
        },
        {
          title: "Pelanggan",
          url: "/customers",
          icon: RiUser3Line,
        },
      ],
    },

    // ======================
    // LAPORAN & AUDIT
    // ======================
    {
      title: "Laporan & Audit",
      items: [
        {
          title: "Riwayat Penjualan",
          url: "/sales-history",
          icon: RiFileList3Line,
        },
        {
          title: "Laporan Penjualan",
          url: "/reports/sales",
          icon: RiBarChartLine,
        },
        {
          title: "Audit Log",
          url: "/audit-logs",
          icon: RiShieldCheckLine,
        },
      ],
    },

    // ======================
    // MANAJEMEN
    // ======================
    {
      title: "Manajemen",
      items: [
        {
          title: "Pengguna",
          url: "/users",
          icon: RiUserSettingsLine,
        },
      ],
    },

    // ======================
    // SETTINGS
    // ======================
    {
      title: "Settings",
      items: [
        {
          title: "Profil Saya",
          url: "/settings/profile",
          icon: RiUserLine,
        },
        {
          title: "Preferensi",
          url: "/settings/preferences",
          icon: RiSettings3Line,
        },
        {
          title: "Import / Export",
          url: "/settings/import-export",
          icon: RiUploadCloud2Line,
        },
      ],
    },
  ],
};
