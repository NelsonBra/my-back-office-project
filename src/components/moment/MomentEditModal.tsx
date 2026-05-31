"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { Trash2, Upload, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../ui/modal";

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

interface MomentEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    moment: Moment | null;
    onUpdate: () => void; // função para atualizar a lista de momentos após salvar
}

export const MomentEditModal: React.FC<MomentEditModalProps> = ({
    isOpen,
    onClose,
    moment,
    onUpdate,
}) => {
    const [selectedMoment, setSelectedMoment] = useState<Moment | null>(moment);
    const [newFiles, setNewFiles] = useState<NewFile[]>([]);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        setSelectedMoment(moment);
        setNewFiles([]);
    }, [moment]);

    if (!selectedMoment) return null;

    const handleDeleteFile = (fileId: number) => {
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

            // Atualiza título/descrição
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moment/${selectedMoment.id}`, {
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
                    `${process.env.NEXT_PUBLIC_API_URL}/moment/${selectedMoment.id}/files`,
                    { method: "POST", body: formData }
                );
                if (!uploadRes.ok) throw new Error("Erro ao enviar arquivos");
            }

            toast.success("Momento atualizado com sucesso");
            onUpdate();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar momento");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] w-full p-0">
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl max-h-[90vh] w-full">
                {/* Conteúdo rolável */}

                <div className="flex-1 overflow-y-auto p-6 pt-20 space-y-4">
                    {/* Título */}
                    <input
                        value={selectedMoment.title}
                        onChange={(e) =>
                            setSelectedMoment({ ...selectedMoment, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-xl"
                        placeholder="Título"
                    />

                    {/* Descrição */}
                    <textarea
                        value={selectedMoment.description}
                        onChange={(e) =>
                            setSelectedMoment({ ...selectedMoment, description: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-xl resize-none"
                        rows={3}
                        placeholder="Descrição"
                    />

                    {/* Arquivos existentes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedMoment.files?.map((file) => (
                            <div
                                key={file.id}
                                className="relative bg-gray-100 p-2 rounded-lg flex flex-col items-center"
                            >
                                {file.file_type === "image" && (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${file.file_url}`}
                                        alt={file.file_name}
                                        className="w-full rounded-lg"
                                    />
                                )}
                                {file.file_type === "video" && (
                                    <video
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${file.file_url}`}
                                        controls
                                        className="w-full rounded-lg"
                                    />
                                )}
                                {file.file_type === "document" && (
                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
                                        <FileText size={24} />
                                        <p className="text-sm break-all">{file.file_name}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDeleteFile(file.id)}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Upload novos arquivos */}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white cursor-pointer hover:border-blue-500 mt-4">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-600">Adicionar arquivos</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </label>

                    {/* Preview novos arquivos */}
                    {newFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {newFiles.map((f, i) => (
                                <div
                                    key={i}
                                    className="relative bg-white rounded-xl shadow-sm p-2"
                                >
                                    {f.type === "image" && f.preview && (
                                        <img
                                            src={f.preview}
                                            className="h-32 w-full object-cover rounded-lg"
                                        />
                                    )}
                                    {f.type === "video" && f.preview && (
                                        <video
                                            src={f.preview}
                                            controls
                                            className="h-32 w-full object-cover rounded-lg"
                                        />
                                    )}
                                    {f.type === "document" && (
                                        <div className="h-32 flex flex-col items-center justify-center text-gray-500 px-2 text-center">
                                            <FileText className="w-10 h-10 mb-2" />
                                            <span className="text-sm break-all">{f.file.name}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => removeNewFile(i)}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer fixo */}
                <div className="flex justify-end p-4 border-t">
                    <button
                        disabled={updating}
                        onClick={handleUpdateMoment}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updating ? "Atualizando..." : "Salvar Alterações"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};