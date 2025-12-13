import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentsTable from "@/components/student-table";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "",
  description:
    "",
 
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pagamentos" />
      <div className="space-y-6">
        <ComponentCard title="">
          <PaymentsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
