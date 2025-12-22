import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import UserTable from "@/components/tables/user-table";
import StudentTable from "@/components/tables/student-table";

export const metadata: Metadata = {
  title: "",
  description:
    "",
 
};

export default function TableStudent() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Estudantes Matriculados" />
      <div className="space-y-6">
        <ComponentCard title="">
          <StudentTable />
        </ComponentCard>
      </div>
    </div>
  );
}
