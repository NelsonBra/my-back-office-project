import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import WelcomeBanner from "@/components/ecommerce/WelcomeBanner";

export const metadata: Metadata = {
  title: "Dashboard | ISPAJ - Backoffice Académico",
  description: "Sistema de Gestão Académica do Instituto Superior Politécnico Alvorecer da Juventude",
};

export default function Ecommerce() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Metrics Cards */}
      <EcommerceMetrics />

      {/* Charts */}
      <MonthlySalesChart />

      {/* Recent Payments Table */}
      <RecentOrders />
    </div>
  );
}
