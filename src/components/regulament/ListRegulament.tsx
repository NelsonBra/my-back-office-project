"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui/modal";

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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Regulamento | null>(null);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const fetchRegulamentos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regulamentos`);
      const data = await res.json();
      if (res.ok) setRegulamentos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    const reg = confirmTarget;
    setConfirmTarget(null);
    setDeletingId(reg.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regulamentos/${reg.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Erro ${res.status} ao remover regulamento`);
      }
      await fetchRegulamentos();
      toast.success("Regulamento removido com sucesso!");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Erro ao remover regulamento");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando regulamentos...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 flex justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Regulamentos do Instituto
          </h1>

          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-6 space-y-4">
            {regulamentos.length === 0 && (
              <p className="text-gray-500 text-center py-6">Nenhum regulamento encontrado.</p>
            )}

            {regulamentos.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between border border-gray-200 dark:border-gray-700 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-brand-100 dark:bg-brand-500/10 p-3 rounded-full flex-shrink-0">
                    <FileText className="text-brand-600 dark:text-brand-400" size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">{reg.file_name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Criado em: {new Date(reg.created_at).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <a
                    href={reg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium hover:underline text-sm"
                  >
                    <Download size={16} />
                    Abrir
                  </a>

                  <button
                    onClick={() => setConfirmTarget(reg)}
                    disabled={deletingId !== null && deletingId === reg.id}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium text-sm
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                    {deletingId !== null && deletingId === reg.id ? "A remover..." : "Remover"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">
            Remover Regulamento
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
            Tem a certeza que deseja remover:
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white text-center mb-6 truncate px-4">
            "{confirmTarget?.file_name}"
          </p>
          <p className="text-xs text-gray-400 text-center mb-6">
            Esta acção é irreversível.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmTarget(null)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium
                hover:bg-red-600 active:bg-red-700 transition-colors"
            >
              Sim, remover
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
