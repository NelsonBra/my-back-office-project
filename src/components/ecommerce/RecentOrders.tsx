"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPaymentMethodLabel, getPaymentStatusLabel } from "@/utils";
import { PaymentMethod, PaymentStatus } from "@/enum";
import { ApiPayment, TablePayment } from "@/types";
import DateRangeFilter from "../filter/DateRangeFilter";
import { Modal } from "../ui/modal";
import { useRouter } from 'next/navigation';





export default function RecentOrders() {

  const [tableData, setTableData] = useState<TablePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  const handleViewAll = () => {
    router.push('/table-payment'); // Next.js navigation
  };

  


  const fetchPayments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        limit: "10",
      });

      if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const res = await fetch(
        `http://localhost:3000/payments?${params.toString()}`
      );

      const data = await res.json();
      const payments = Array.isArray(data.payments) ? data.payments : [];

      const mapped: TablePayment[] = payments.map((p: any) => ({
        id: p.payment_id,
        valor: `${Number(p.value_paid).toFixed(2)} Kz`,
        curso: p.course.course_name,
        servico: p.fee_type.fee_type_name,
        metodo: p.method_payment as PaymentMethod,
        status: p.status as PaymentStatus,
        data: new Date(p.data_payment).toLocaleDateString("pt-PT"),
        studentName: p.student.student_name,
        numero: p.payment_number || "—",
        comprovativo: p.proof,
      }));

      setTableData(mapped);
    } catch (error) {
      console.error("Failed to load payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);




  if (loading) {
    return <p className="p-4 text-gray-500">Carregando pagamentos...</p>;
  }
  return (
    <>
      <Modal
        isOpen={showFilter}       
        onClose={() => setShowFilter(false)}
        className="max-w-md p-6"
      >
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={() => {
            fetchPayments();
            setShowFilter(false);
          }}
        />
      </Modal>


      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Pagamentos recentes
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilter((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <svg
                className="stroke-current fill-white dark:fill-gray-800"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
              </svg>
              Filtro
            </button>
            <button   onClick={handleViewAll}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              Ver todos
            </button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>

            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Pagamento
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Categoria
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Valor
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Estado
                </TableCell>
              </TableRow>
            </TableHeader>



            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tableData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] rounded-md bg-gray-100 flex items-center justify-center">
                        💳
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.studentName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {payment.numero}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {getPaymentMethodLabel(payment.metodo)}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {payment.curso} • {payment.servico}
                  </TableCell>

                  <TableCell>{payment.valor}</TableCell>

                  <TableCell>
                    <Badge
                      size="sm"
                      color={
                        payment.status === PaymentStatus.Paid
                          ? "success"
                          : "warning"
                      }
                    >
                      {getPaymentStatusLabel(payment.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>



          </Table>
        </div>


      </div>


    </>
  );
}
