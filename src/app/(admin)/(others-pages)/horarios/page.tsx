"use client";
import { getFileUrl } from '../../../../utils/fileUrl';

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import Select from "@/components/form/Select";

type Course = { id: number; nome: string; descricao?: string };

type Schedule = {
  id: number;
  courseId: number;
  year: number;
  semester: number | null;
  pdf: string | null;
};

export default function HorariosPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterCourseId, setFilterCourseId] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [formCourseId, setFormCourseId] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [formPdf, setFormPdf] = useState<File | null>(null);

  const { isOpen: isCreateOpen, openModal: openCreate, closeModal: closeCreate } = useModal();
  const { isOpen: isUploadOpen, openModal: openUpload, closeModal: closeUpload } = useModal();

  const fetchSchedules = async (courseId = filterCourseId, year = filterYear) => {
    const params = new URLSearchParams();
    if (courseId) params.append("course_id", courseId);
    if (year) params.append("year", year);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class-schedules?${params.toString()}`);
    const data = await res.json();
    setSchedules(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`)
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []));
    fetchSchedules("", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSchedules(filterCourseId, filterYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCourseId, filterYear]);

  const resetForm = () => {
    setFormCourseId("");
    setFormYear("");
    setFormSemester("");
    setFormPdf(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCourseId || !formYear || !formSemester) return;

    const courseName = courses.find((c) => String(c.id) === formCourseId)?.nome ?? "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class-schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: formCourseId,
        year: formYear,
        semester: formSemester,
        title: `${courseName} - ${formYear}º Ano - ${formSemester}º Sem.`,
      }),
    });

    if (res.ok && formPdf) {
      const { id } = await res.json();
      const fd = new FormData();
      fd.append("pdf", formPdf);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class-schedules/${id}/pdf`, {
        method: "POST",
        body: fd,
      });
    }

    resetForm();
    closeCreate();
    fetchSchedules();
  };

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || selectedScheduleId === null) return;
    const fd = new FormData();
    fd.append("pdf", pdfFile);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class-schedules/${selectedScheduleId}/pdf`, {
      method: "POST",
      body: fd,
    });
    setPdfFile(null);
    closeUpload();
    fetchSchedules();
  };

  const handleRemovePdf = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class-schedules/${id}/pdf`, { method: "DELETE" });
    fetchSchedules();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem a certeza que quer eliminar este horário?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class-schedules/${id}`, { method: "DELETE" });
    fetchSchedules();
  };

  const courseOptions = courses.map((c) => ({ value: String(c.id), label: `${c.nome} - ${(c.descricao ?? "").split(" ")[0]}`.trim().replace(/\s*-\s*$/, "") }));
  const yearOptions = [1, 2, 3, 4, 5].map((y) => ({ value: String(y), label: `${y}º Ano` }));
  const semesterOptions = [
    { value: "1", label: "1º Semestre" },
    { value: "2", label: "2º Semestre" },
  ];
  const filterCourseOptions = [{ value: "", label: "Todos os cursos" }, ...courseOptions];
  const filterYearOptions = [{ value: "", label: "Todos os anos" }, ...yearOptions];

  const courseName = (id: number) => { const c = courses.find((c) => c.id === id); return c ? `${c.nome} - ${(c.descricao ?? "").split(" ")[0]}`.trim().replace(/\s*-\s*$/, "") : "—"; };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Horários de Aulas</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 text-sm font-medium"
        >
          + Novo Horário
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="w-56">
          <Select
            label="Filtrar por Curso"
            options={filterCourseOptions}
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            label="Filtrar por Ano"
            options={filterYearOptions}
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Curso</th>
              <th className="px-4 py-3 text-left">Ano</th>
              <th className="px-4 py-3 text-left">Semestre</th>
              <th className="px-4 py-3 text-left">PDF</th>
              <th className="px-4 py-3 text-left">Acções</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {schedules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Nenhum horário encontrado.
                </td>
              </tr>
            )}
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-gray-800 dark:text-white">{courseName(s.courseId)}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.year}º Ano</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {s.semester ? `${s.semester}º Semestre` : "—"}
                </td>
                <td className="px-4 py-3">
                  {s.pdf ? (
                    <button
                      onClick={() => window.open(getFileUrl(s.pdf), "_blank")}
                      className="text-brand-500 hover:underline text-sm"
                    >
                      Ver PDF
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => { setSelectedScheduleId(s.id); openUpload(); }}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      Upload PDF
                    </button>
                    {s.pdf && (
                      <button
                        onClick={() => handleRemovePdf(s.id)}
                        className="px-2 py-1 text-xs bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
                      >
                        Remover PDF
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Novo Horário</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <Select
                label="Curso"
                id="course_id"
                options={courseOptions}
                value={formCourseId}
                onChange={(e) => setFormCourseId(e.target.value)}
              />
              <Select
                label="Ano"
                id="year"
                options={yearOptions}
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
              />
              <Select
                label="Semestre"
                id="semester"
                options={semesterOptions}
                value={formSemester}
                onChange={(e) => setFormSemester(e.target.value)}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  PDF (opcional)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormPdf(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { closeCreate(); resetForm(); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formCourseId || !formYear || !formSemester}
                  className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload PDF Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Upload de PDF</h2>
            <form onSubmit={handleUploadPdf} className="flex flex-col gap-4">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { closeUpload(); setPdfFile(null); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!pdfFile}
                  className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
