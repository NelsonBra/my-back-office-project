"use client";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import CheckboxComponents from "./form-elements/CheckboxComponents";
import DefaultInputs from "./form-elements/DefaultInputs";
import DropzoneComponent from "./form-elements/DropZone";
import FileInputExample from "./form-elements/FileInputExample";
import InputGroup from "./form-elements/InputGroup";
import RadioButtons from "./form-elements/RadioButtons";
import ToggleSwitch from "./form-elements/ToggleSwitch";
import Input from "./input/InputField";
import DatePicker from "./date-picker";
import Select from "./Select";
import { toast } from "react-toastify";


type User = {
    id: number;
    nome: string;
    email: string;
    password: string;
    data_criacao: string;
};


export default function StudentForm() {
    const [formData, setFormData] = useState({
        user_id: "",
        nome: "",
        email: "",
        nif: "",
        telemovel: "",
        filiacao: "",
        morada: "",
        data_nascimento: "",
        data_criacao: "",
    });


    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.log("Error loading users:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;


        if (name === "user_id") {
            const selectedUser = users.find((user) => user.id.toString() === value);
            if (selectedUser) {
                setFormData((prev) => ({
                    ...prev,
                    user_id: value,
                    nome: selectedUser.nome,
                    email: selectedUser.email,
                }));
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create student");
            }

            const data = await response.json();

            setFormData({
                user_id: "",
                nome: "",
                email: "",
                nif: "",
                telemovel: "",
                filiacao: "",
                morada: "",
                data_nascimento: "",
                data_criacao: "",
            });

            toast.success("Student created successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error creating student");
        }
    };


    return (
        <div>
            <PageBreadcrumb pageTitle="Adicionar Estudante" />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">


                    <Select
                        label="Aluno Inscrito"
                        name="user_id"
                        value={formData.user_id}
                        onChange={(e) => {
                            const value = e.target.value;

                            const selectedUser = users.find(
                                user => user.id.toString() === value
                            );

                            setFormData(prev => ({
                                ...prev,
                                user_id: value,
                                nome: selectedUser?.nome || "",
                                email: selectedUser?.email || "",
                            }));
                        }}
                        options={users.map(user => ({
                            value: user.id.toString(),
                            label: user.nome,
                        }))}
                    />




                </div>
                <div className="space-y-6">
                    <Input
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                    />
                    <Input
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        label="NIF"
                        name="nif"
                        value={formData.nif}
                        onChange={handleChange}
                    />
                    <Input
                        label="Telemóvel"
                        name="telemovel"
                        value={formData.telemovel}
                        onChange={handleChange}
                    />
                    <Input
                        label="Filiação"
                        name="filiacao"
                        value={formData.filiacao}
                        onChange={handleChange}
                    />
                    <Input
                        label="Morada"
                        name="morada"
                        value={formData.morada}
                        onChange={handleChange}
                    />
                    <DatePicker
                        id="data_nascimento"
                        label="Data de Nascimento"
                        defaultDate={formData.data_nascimento}
                        onChange={(dates, dateStr) => {
                            handleChange({
                                target: { name: "data_nascimento", value: dateStr }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                    />


                </div>



                <div className="col-span-1 xl:col-span-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Adicionar Estudante
                    </button>
                </div>
            </form>
        </div>
    );
}
