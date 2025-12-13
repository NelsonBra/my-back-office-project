"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "../ui/badge/Badge";
import { EyeCloseIcon } from "@/icons";


type ApiPayment = {
    payment_id: number;
    usuario_id: number;
    student_id: number;
    fees_id: number | null;
    fees_course_id: number;
    fee_type_id: number;
    value_paid: string;
    data_payment: string;
    method_payment: string;
    payment_number: string;
    proof: string;
    amount: string;
    status: string;
    payment_date: string;
};

type FeeType = {
    fee_type_id: number;
    name: string;
    description: string;
    price: string;
};

type Course = {
    course_id: number;
    course_name: string;
    description: string;
    category_id: number;
};

type TablePayment = {
    id: number;
    valor: string;
    curso: string;
    servico: string;
    metodo: string;
    status: string;
    data: string;
    numero: string;
    comprovativo?: string;
};




export default function PaymentsTable() {
    const [payments, setPayments] = useState<TablePayment[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("2024-2025");

    const [courses, setCourses] = useState([]);
    const [services, setServices] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);



    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // 1️⃣ Fetch payments
                const resPayments = await fetch(
                    `http://localhost:3000/payments?ano_letivo=${anoSelecionado}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!resPayments.ok) throw new Error("Failed to fetch payments");
                const paymentsData: ApiPayment[] = await resPayments.json();

                // 2️⃣ Map payments and fetch course/service names by ID
                const mappedPayments: TablePayment[] = await Promise.all(
                    paymentsData.map(async (p) => {
                        // Fetch service name
                        let servico = `Service ${p.fee_type_id}`;
                        try {
                            const resService = await fetch(`http://localhost:3000/fees-types?fee_type_id=${p.fee_type_id}`);
                            if (resService.ok) {
                                const dataService = await resService.json();
                                servico = dataService.name;
                            }
                        } catch (err) {
                            console.error("Failed to fetch service", err);
                        }

                        // Fetch course name
                        let curso = `Course ${p.fees_course_id}`;
                        try {
                            const resCourse = await fetch(`http://localhost:3000/courses/${p.fees_course_id}`);
                            if (resCourse.ok) {
                                const dataCourse = await resCourse.json();
                                curso = dataCourse.course_name;
                            }
                        } catch (err) {
                            console.error("Failed to fetch course", err);
                        }

                        return {
                            id: p.payment_id,
                            valor: p.value_paid,
                            curso,
                            servico,
                            metodo: p.method_payment,
                            status: p.status === "pendente" ? "Pendente" : "Pago",
                            data: new Date(p.data_payment).toLocaleDateString("pt-PT"),
                            numero: p.payment_number,
                            comprovativo: p.proof,
                        };
                    })
                );

                setPayments(mappedPayments);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [anoSelecionado]);


    if (loading) return <p>Carregando pagamentos...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1100px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/10">
                            <TableRow>
                                {["ID", "Valor Pago", "Curso", "Serviço", "Método", "Status", "Data", "Nº Pagamento", "Comprovativo"].map((title) => (
                                    <TableCell key={title} isHeader className="px-5 py-3 text-gray-500 font-medium text-theme-xs">{title}</TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                            {payments.map((p) => (
                                <TableRow key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                    <TableCell className="px-5 py-4">{p.id}</TableCell>
                                    <TableCell className="px-5 py-4 text-green-600 font-semibold">{p.valor} Kz</TableCell>
                                    <TableCell className="px-5 py-4">{p.curso}</TableCell>
                                    <TableCell className="px-5 py-4">{p.servico}</TableCell>
                                    <TableCell className="px-5 py-4">{p.metodo}</TableCell>
                                    <TableCell className="px-5 py-4">
                                        <Badge size="sm" color={p.status === "Paid" ? "success" : "warning"}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">{p.data}</TableCell>
                                    <TableCell className="px-5 py-4">{p.numero}</TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        {p.comprovativo ? (
                                            <a
                                                href={`http://localhost:3000/uploads/${p.comprovativo}`}
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
                                        {p.status !== "Paid" && (
                                            <button
                                                // onClick={() => handleValidatePayment(p.id)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            >
                                                Validate
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
