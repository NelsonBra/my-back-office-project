"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

type MomentFile = {
    file: File;
    type: "image" | "video" | "document";
    preview: string | null;
};

export default function MomentsUploadScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<MomentFile[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        const mapped: MomentFile[] = selectedFiles.map((file) => ({
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

        setFiles((prev) => [...prev, ...mapped]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const item = prev[index];
            if (item?.preview) URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const publishMoment = async () => {
        if (!title) {
            alert("Título é obrigatório");
            return;
        }

        try {
            setLoading(true);


            const momentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (!momentRes.ok) throw new Error("Erro ao criar momento");

            const { id: momentId } = await momentRes.json();


            if (files.length > 0) {
                const formData = new FormData();
                files.forEach((item) => {
                    formData.append("files", item.file);
                });

                const uploadRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/moment/${momentId}/files`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!uploadRes.ok) throw new Error("Erro ao enviar arquivos");
            }

            toast.success("Momento publicado com sucesso 🎉");

            // Reset
            setTitle("");
            setDescription("");
            setFiles([]);
        } catch (error) {
            console.error(error);
            toast.success("Erro ao publicar momento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold mb-2">Momentos</h1>
                <p className="text-gray-600 mb-6">
                    Adicione fotos, vídeos ou documentos para a vitrine virtual
                </p>

                {/* Title */}
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do momento"
                    className="w-full mb-4 px-4 py-2 rounded-xl border"
                />

                {/* Description */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição (opcional)"
                    className="w-full mb-6 px-4 py-2 rounded-xl border resize-none"
                    rows={3}
                />

                {/* Upload box */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 bg-white cursor-pointer hover:border-brand-500 transition">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-600">
                        Clique ou arraste arquivos aqui
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                        JPG, PNG, MP4, PDF, DOCX
                    </span>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFiles}
                    />
                </label>

                {/* Preview grid */}
                {files.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                        {files.map((item, index) => (
                            <div
                                key={index}
                                className="relative bg-white rounded-xl shadow-sm p-2"
                            >
                                {item.type === "image" && item.preview && (
                                    <img
                                        src={item.preview}
                                        className="h-40 w-full object-cover rounded-lg"
                                    />
                                )}

                                {item.type === "video" && item.preview && (
                                    <video
                                        src={item.preview}
                                        controls
                                        className="h-40 w-full object-cover rounded-lg"
                                    />
                                )}

                                {item.type === "document" && (
                                    <div className="h-40 flex flex-col items-center justify-center text-gray-500 px-2 text-center">
                                        <FileText className="w-10 h-10 mb-2" />
                                        <span className="text-sm break-all">
                                            {item.file.name}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action */}
                {files.length > 0 && (
                    <div className="flex justify-end mt-8">
                        <button
                            disabled={loading}
                            onClick={publishMoment}
                            className="px-6 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
                        >
                            {loading ? "Publicando..." : "Publicar Momentos"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}