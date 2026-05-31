"use client";

import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { toast } from "react-toastify";

export default function RegulamentosPage() {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }
        setFile(selectedFile);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
          toast.warning("Selecione um PDF primeiro.");
          return;
        }
      
        if (file.type !== "application/pdf") {
          toast.error("Apenas ficheiros PDF são permitidos.");
          return;
        }
      
        try {
          setUploading(true);
      
          const formData = new FormData();
          formData.append("file", file); // must match upload.single("file")
      
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regulamentos`, {
            method: "POST",
            body: formData,
          });
      
          let data = null;
      
          // safely try to parse JSON
          const text = await response.text();
          try {
            data = JSON.parse(text);
          } catch {
            data = { error: text };
          }
      
          if (!response.ok) {
            console.error("UPLOAD ERROR:", data);
            toast.error(data?.error || "Erro ao enviar regulamento.");
            return;
          }
      
          toast.success("Regulamento enviado com sucesso!");
          setFile(null);
      
          // reset input element (important)
          const input = document.getElementById("fileInput") as HTMLInputElement;
          if (input) input.value = "";
      
        } catch (error) {
          console.error("NETWORK ERROR:", error);
          toast.error("Não foi possível conectar ao servidor.");
        } finally {
          setUploading(false);
        }
      };



    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-blue-600" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Regulamentos do Instituto
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Faça upload do regulamento oficial em PDF
                    </p>
                </div>

                {/* Drag & Drop Area */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                        }`}
                >
                    <UploadCloud className="mx-auto text-gray-400" size={32} />
                    <p className="mt-3 text-gray-600 font-medium">
                        Drag & drop your PDF here
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        or click below to select
                    </p>

                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        id="fileInput"
                        onChange={(e) => {
                            if (e.target.files) {
                                handleFile(e.target.files[0]);
                            }
                        }}
                    />

                    <label
                        htmlFor="fileInput"
                        className="inline-block mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition"
                    >
                        Select PDF
                    </label>
                </div>

                {/* File Preview */}
                {file && (
                    <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-200">
                        <p className="text-green-700 font-medium">
                            📄 {file.name}
                        </p>
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    className="mt-6 w-full bg-brand-600 text-white py-3 rounded-2xl font-semibold hover:bg-brand-700 transition"
                >
                    Guardar Regulamento
                </button>
            </div>
        </div>
    );
}
