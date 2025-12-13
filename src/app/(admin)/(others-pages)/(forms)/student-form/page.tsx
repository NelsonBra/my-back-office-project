import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StudentForm from "@/components/form/student-form";



export default function Students() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pagamentos" />
      <div className="space-y-6">
        <ComponentCard title="">
          <StudentForm />
        </ComponentCard>
      </div>
    </div>
  );
}