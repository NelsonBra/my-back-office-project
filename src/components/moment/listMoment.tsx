"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Trash2, Upload, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import { MomentEditModal } from "./MomentEditModal";
import { useRouter } from 'next/navigation';

type MomentFile = {
    id: number;
    file_name: string;
    file_url: string;
    file_type: "image" | "video" | "document";
};

type Moment = {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    files?: MomentFile[];
};

type NewFile = {
    file: File;
    preview: string | null;
    type: "image" | "video" | "document";
};

export default function MomentsAdminScreen() {
    const [moments, setMoments] = useState<Moment[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newFiles, setNewFiles] = useState<NewFile[]>([]);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    // Fetch all moments
    const fetchMoments = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/moment");
            const data: Moment[] = await res.json();
            setMoments(data);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar momentos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoments();
    }, []);

    const openModal = async (moment: Moment) => {
        try {
            const res = await fetch(`http://localhost:3000/moment/${moment.id}`);
            const data: Moment = await res.json();
            setSelectedMoment(data);
            setNewFiles([]);
            setModalOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao buscar momento");
        }
    };

    const closeModal = () => {
        setSelectedMoment(null);
        setNewFiles([]);
        setModalOpen(false);
    };

    const handleDeleteMoment = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar este momento?")) return;
        try {
            const res = await fetch(`http://localhost:3000/moment/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao deletar");
            toast.success("Momento deletado com sucesso");
            fetchMoments();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao deletar momento");
        }
    };

    const handleDeleteFile = (fileId: number) => {
        if (!selectedMoment) return;
        setSelectedMoment({
            ...selectedMoment,
            files: selectedMoment.files?.filter((f) => f.id !== fileId),
        });
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).map((file) => ({
            file,
            type: file.type.startsWith("image")
                ? "image"
                : file.type.startsWith("video")
                    ? "video"
                    : "document",
            preview:
                file.type.startsWith("image") || file.type.startsWith("video")
                    ? URL.createObjectURL(file)
                    : null,
        }));
        setNewFiles((prev: any) => [...prev, ...filesArray]);
    };

    const removeNewFile = (index: number) => {
        const f = newFiles[index];
        if (f.preview) URL.revokeObjectURL(f.preview);
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateMoment = async () => {
        if (!selectedMoment) return;
        try {
            setUpdating(true);

            // Atualizar título/descrição
            const res = await fetch(`http://localhost:3000/moment/${selectedMoment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: selectedMoment.title,
                    description: selectedMoment.description,
                    is_published: 1,
                }),
            });
            if (!res.ok) throw new Error("Erro ao atualizar momento");

            // Upload de novos arquivos
            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach((f) => formData.append("files", f.file));
                const uploadRes = await fetch(
                    `http://localhost:3000/moment/${selectedMoment.id}/files`,
                    { method: "POST", body: formData }
                );
                if (!uploadRes.ok) throw new Error("Erro ao enviar arquivos");
            }

            toast.success("Momento atualizado com sucesso");
            fetchMoments();
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar momento");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header com botão Novo Momento */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Momentos</h1>
                <button
                   onClick={() => router.push("/momment")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700"
                >
                    <Upload size={16} /> Novo Momento
                </button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <Table className="bg-white rounded-lg shadow overflow-hidden">
                    <TableHeader className="bg-gray-100 text-left">
                        <TableRow>
                            <TableCell isHeader className="px-4 py-2">Título</TableCell>
                            <TableCell isHeader className="px-4 py-2">Descrição</TableCell>
                            <TableCell isHeader className="px-4 py-2">Criado em</TableCell>
                            <TableCell isHeader className="px-4 py-2">Ações</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {moments.map((moment) => (
                            <TableRow key={moment.id} className="border-b">
                                <TableCell className="px-4 py-2">{moment.title}</TableCell>
                                <TableCell className="px-4 py-2">{moment.description}</TableCell>
                                <TableCell className="px-4 py-2">
                                    {new Date(moment.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="px-4 py-2 flex items-center gap-2">
                                    <button
                                        onClick={() => openModal(moment)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <Upload size={16} /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMoment(moment.id)}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={16} /> Deletar
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <MomentEditModal
                isOpen={modalOpen}
                onClose={closeModal}
                moment={selectedMoment}
                onUpdate={fetchMoments}
            />
        </div>
    );
}