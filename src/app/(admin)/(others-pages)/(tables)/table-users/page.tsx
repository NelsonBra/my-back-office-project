import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import UserTable from "@/components/tables/user-table";

export const metadata: Metadata = {
  title: "",
  description:
    "",
 
};

export default function TableStudent() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Estudantes inscritos" />
      <div className="space-y-6">
        <ComponentCard title="">
          <UserTable />
        </ComponentCard>
      </div>
    </div>
  );
}
