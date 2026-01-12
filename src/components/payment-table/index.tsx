"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "../ui/badge/Badge";
import { EyeCloseIcon } from "@/icons";
import { PaymentMethod, PaymentStatus, } from "@/enum";
import { ApiPayment, FeeType, TablePayment } from "@/types";
import ConfirmModal from "../ui/modal/ConfirmModal";
import { toast } from "react-toastify";




const paymentStatusLabel = (status: PaymentStatus) =>
    status === PaymentStatus.Paid ? "Pago" : "Pendente";

const paymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
        case PaymentMethod.Multibanco:
            return "Multibanco";
        case PaymentMethod.Transferencia:
            return "Transferência";
        default:
            return "—";
    }
};





export default function PaymentsTable() {
    const [payments, setPayments] = useState<TablePayment[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("2025-2026");
    const [feesTypes, setFeesTypes] = useState<FeeType[]>([]);
    const [loadingFees, setLoadingFees] = useState(false);
    const [students, setStudents] = useState<{ id: number; nome: string }[]>([]);
    const [selectedFeeType, setSelectedFeeType] = useState<string>("all");
    const [selectedStudent, setSelectedStudent] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);










    const fetchPayments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const params = new URLSearchParams();
            params.append("ano_letivo", anoSelecionado);

            if (selectedFeeType !== "all") {
                params.append("fee_type_id", selectedFeeType);
            }

            if (selectedStudent !== "all") {
                params.append("student_id", selectedStudent);
            }

            const resPayments = await fetch(
                `http://localhost:3000/payments?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!resPayments.ok) throw new Error("Failed to fetch payments");

            const data = await resPayments.json();

            const mappedPayments = data.payments.map((p: ApiPayment) => ({
                id: p.payment_id,
                valor: p.value_paid,
                curso: p.course?.course_name ?? "—",
                servico: p.fee_type?.fee_type_name ?? "—",
                studentId: p.student?.student_id,
                studentName: p.student?.student_name ?? "—",
                metodo: p.method_payment,
                status: p.status,
                data: new Date(p.data_payment).toLocaleDateString("pt-PT"),
                numero: p.payment_number,
                comprovativo: p.proof,
            }));

            setPayments(mappedPayments);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [anoSelecionado, selectedFeeType, selectedStudent]);



    useEffect(() => {
        const fetchFeesTypes = async () => {
            try {
                setLoadingFees(true);

                const res = await fetch("http://localhost:3000/fees-types");

                if (!res.ok) {
                    throw new Error("Failed to fetch fees types");
                }

                const data: FeeType[] = await res.json();
                setFeesTypes(data);
            } catch (err) {
                console.error("Error fetching fees types", err);
            } finally {
                setLoadingFees(false);
            }
        };

        fetchFeesTypes();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3000/students", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch students");
                const data = await res.json();

                // Extract the data array and map to the shape you need
                const studentsArray = data.data.map((s: any) => ({
                    id: s.id,
                    nome: s.nome,
                }));

                setStudents(studentsArray);
            } catch (err) {
                console.error(err);
                setStudents([]);
            }
        };

        fetchStudents();
    }, []);




    const handleValidatePayment = async (paymentId: number) => {
        try {
            const res = await fetch(
                `http://localhost:3000/payments/${paymentId}/validate`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Falha ao validar pagamento");
            }

            toast.success("Pagamento validado com sucesso ✅");
            setTimeout(() => {
                window.location.reload();
            }, 800);


        } catch (error) {
            console.error("Erro ao validar pagamento", error);
            toast.error("Erro ao validar pagamento ❌");
        }
    };



    if (loading) return <p>Carregando pagamentos...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="max-w-full overflow-x-auto">

                <div className="flex items-center gap-4 mb-4">

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">
                            Filtrar por serviços:
                        </label>
                        <select
                            value={selectedFeeType}
                            onChange={(e) => setSelectedFeeType(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/5 dark:border-white/10"
                        >
                            <option value="all">Todos serviços</option>
                            {feesTypes.map((fee) => (
                                <option key={fee.id} value={fee.id}>
                                    {fee.nome}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">
                            Filtrar por estudante:
                        </label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/5 dark:border-white/10"
                        >
                            <option value="all">Todos estudantes</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                <div className="min-w-[1100px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/10">
                            <TableRow>
                                {["ID", "Nome", "Valor Pago", "Curso", "Serviço", "Método", "Status", "Data", "Nº Pagamento", "Comprovativo"].map((title) => (
                                    <TableCell key={title} isHeader className="px-5 py-3 text-gray-500 font-medium text-theme-xs">{title}</TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                            {payments.map((p) => (
                                <TableRow key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                    <TableCell className="px-5 py-4">{p.id}</TableCell>
                                    <TableCell className="px-5 py-4">{p.studentName}</TableCell>
                                    <TableCell className="px-5 py-4 text-green-600 font-semibold">{p.valor} Kz</TableCell>
                                    <TableCell className="px-5 py-4">{p.curso}</TableCell>
                                    <TableCell className="px-5 py-4">{p.servico}</TableCell>
                                    <TableCell className="px-5 py-4">
                                        {paymentMethodLabel(p.metodo)}
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <Badge
                                            size="sm"
                                            color={p.status === PaymentStatus.Paid ? "success" : "warning"}
                                        >
                                            {paymentStatusLabel(p.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">{p.data}</TableCell>
                                    <TableCell className="px-5 py-4">{p.numero}</TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        {p.comprovativo ? (
                                            <a

                                                href={`http://localhost:3000/uploads/${encodeURIComponent(p.comprovativo)}`}
                                                target="_blank"
                                                className="text-blue-600 hover:text-blue-800"
                                                title="View proof"
                                            >
                                                <EyeCloseIcon size={20} />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        {p.status !== PaymentStatus.Paid && (
                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                onClick={() => {
                                                    setSelectedPaymentId(p.id);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Validar
                                            </button>

                                        )}
                                    </TableCell>


                                    <ConfirmModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        onConfirm={() => {
                                            if (selectedPaymentId !== null) {
                                                handleValidatePayment(selectedPaymentId);
                                            }
                                        }}
                                        title="Validar Pagamento"
                                        message={`Tem certeza que deseja validar o pagamento #${selectedPaymentId}?`}
                                    />


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
