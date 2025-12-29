import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentForm from "@/components/form/payment-form";
import StudentForm from "@/components/form/student-form";



export default function Payments() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pagamentos" />
      <div className="space-y-6">
        <ComponentCard title="">
          <PaymentForm />
        </ComponentCard>
      </div>
    </div>
  );
}