"use client";

import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";

type Regulamento = {
  id: number;
  file_url: string;
  file_name: string;
  created_at: string;
};

export default function RegulamentosList() {
  const [regulamentos, setRegulamentos] = useState<Regulamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegulamentos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regulamentos`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erro ao carregar regulamentos");
          return;
        }

        setRegulamentos(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível conectar ao servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchRegulamentos();
  }, []);

  if (loading) return <p className="text-center mt-10">Carregando regulamentos...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Regulamentos do Instituto
        </h1>

        <div className="bg-white shadow-xl rounded-3xl p-6 space-y-4">
          {regulamentos.length === 0 && (
            <p className="text-gray-500 text-center">Nenhum regulamento encontrado.</p>
          )}

          {regulamentos.map((reg) => (
            <div
              key={reg.id}
              className="flex items-center justify-between border p-4 rounded-xl hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-brand-100 p-3 rounded-full">
                  <FileText className="text-brand-600" size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{reg.file_name}</p>
                  <p className="text-gray-500 text-sm">
                    Criado em: {new Date(reg.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <a
                href={reg.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand-600 font-medium hover:underline"
              >
                <Download size={18} />
                Abrir
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
