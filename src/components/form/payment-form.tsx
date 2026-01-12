"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import Select from "./Select";
import Input from "./input/InputField";
import DatePicker from "./date-picker";
import { PaymentFormData, User, Course, CourseFee, FeeType } from '@/types';
import { PaymentMethod, PaymentStatus } from "@/enum";
import { toast } from "react-toastify";







export default function Payments() {
    const [students, setStudent] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [feeTypes, setFeeTypes] = useState<CourseFee[]>([]);
    const [formData, setFormData] = useState<PaymentFormData>({
        user_id: "",
        nome: "",
        email: "",
        value_paid: "",
        course_id: "",
        fee_type_id: "",
        method_payment: PaymentMethod.Multibanco,
        status: PaymentStatus.Paid,
        data_payment: new Date().toISOString().split("T")[0],
    });


    useEffect(() => {
        fetch("http://localhost:3000/students")
            .then((res) => res.json())
            .then((response) => setStudent(response.data)) 
            .catch((err) => console.log("Error loading users:", err));
    }, []);



    useEffect(() => {
        const fetchCourses = async () => {
            const res = await fetch("http://localhost:3000/courses");
            const data = await res.json();
            setCourses(data);
        };

        fetchCourses();
    }, []);








    const fetchFeesByCourse = async (courseId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/courses/${courseId}/fees`);
            if (!res.ok) throw new Error("Failed to fetch fees for course");
            const data: { course: any; fees: CourseFee[] } = await res.json();
            setFeeTypes(data.fees);
        } catch (err) {
            console.error(err);
            setFeeTypes([]);
        }
    };


    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (name === "course_id") {

            setFeeTypes([]);
            setFormData(prev => ({
                ...prev,
                fee_type_id: "",
                value_paid: "",
            }));

            fetchFeesByCourse(value);
        }

        if (name === "fee_type_id") {
            const selectedFee = feeTypes.find(f => f.fee_type_id.toString() === value);

            if (selectedFee) {
                setFormData(prev => ({
                    ...prev,
                    value_paid: selectedFee.price.toString(),
                }));
            }
        }
    };

    const handleSubmit = async () => {
        try {

            const payload = {
                user_id: formData.user_id,
                nome: formData.nome,
                email: formData.email,
                student_id: formData.user_id,
                usuario_id: 1,
                course_id: Number(formData.course_id),
                fee_type_id: Number(formData.fee_type_id),
                value_paid: Number(formData.value_paid),
                method_payment: Number(formData.method_payment),
                status: Number(formData.status),
                data_payment: formData.data_payment,
                payment_number: `PAY-${Date.now()}`,
                proof: null
            };

            const res = await fetch("http://localhost:3000/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create payment");

            const data = await res.json();
            console.log("Payment created:", data);


            setFormData(prev => ({
                ...prev,
                value_paid: "",
                course_id: "",
                fee_type_id: "",
                method_payment: PaymentMethod.Multibanco,
                status: PaymentStatus.Paid,
            }));


            toast.success("Pagamento efetuado com sucesso!");
        } catch (err: any) {
            console.error(err);
            toast.error("Error adding payment: " + err.message);
        }
    };



    return (
        <div>
            <PageBreadcrumb pageTitle="Adicionar Pagamento" />

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="grid grid-cols-1 gap-6 xl:grid-cols-2"
            >
                <div className="space-y-6">
                    <Select
                        label="Aluno"
                        name="user_id"
                        value={formData.user_id}
                        onChange={(e) => {
                            const value = e.target.value;
                            const selectedUser = students.find(students => students.id.toString() === value);
                            setFormData(prev => ({
                                ...prev,
                                user_id: value,
                                nome: selectedUser?.nome || "",
                                email: selectedUser?.email || "",
                            }));
                        }}
                        options={students?.map(students => ({
                            value: students.id.toString(),
                            label: students.nome,
                        }))}
                    />

                    <Input
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={onChange}
                    />
                    <Input
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                    />



                    <Select
                        label="Curso"
                        name="course_id"
                        value={formData.course_id}
                        onChange={onChange}
                        options={courses.map(course => ({
                            value: course.id.toString(),
                            label: course.nome,
                        }))}
                    />

                    <Select
                        label="Tipo de Serviço"
                        name="fee_type_id"
                        value={formData.fee_type_id}
                        onChange={onChange}
                        options={feeTypes.map(f => ({
                            value: f.fee_type_id.toString(),
                            label: f.fee_type_name,
                        }))}
                    />

                    <Input
                        label="Valor"
                        name="value_paid"
                        value={formData.value_paid}
                        onChange={onChange}
                    />

                    <Select
                        label="Método de Pagamento"
                        name="method_payment"
                        value={formData.method_payment}
                        onChange={onChange}
                        options={[
                            { value: PaymentMethod.Multibanco, label: "Multibanco" },
                            { value: PaymentMethod.Transferencia, label: "Transferência" },
                        ]}
                    />





                </div>

                <div className="col-span-1 xl:col-span-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Adicionar Pagamento
                    </button>
                </div>
            </form>
        </div>
    );
}
