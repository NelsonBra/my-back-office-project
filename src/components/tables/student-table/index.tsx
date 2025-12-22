"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EyeCloseIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";

interface Student {
  id: number;
  nome: string;
  email: string;
  nif: string;
  telemovel: string;
  data_criacao: string;
  user_id: number;
  filiacao: string;
  morada: string;
  data_nascimento: string;
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("http://localhost:3000/students");

        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }

        const data: Student[] = await res.json();
        setStudents(data);
      } catch (err) {
        setError("Error loading students");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  if (loading) {
    return <p className="text-gray-500 px-5 py-4">Loading students...</p>;
  }

  if (error) {
    return <p className="text-red-500 px-5 py-4">{error}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/10">
              <TableRow>
                {[
                  "ID",
                  "Nome",
                  "Email",
                  "NIF",
                  "Telemóvel",
                  "Filiação",
                  "Morada",
                  "Data Nascimento",
                  "Criado em",
                  "Ações",
                ].map((title) => (
                  <TableCell
                    key={title}
                    isHeader
                    className="px-5 py-3 text-gray-500 font-medium text-theme-xs"
                  >
                    {title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <TableCell className="px-5 py-4">{student.id}</TableCell>

                  <TableCell className="px-5 py-4 font-medium">
                    {student.nome}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {student.email}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {student.nif}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {student.telemovel}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {student.filiacao}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {student.morada}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500">
                    {student.data_nascimento && student.data_nascimento !== "0000-00-00"
                      ? new Date(student.data_nascimento).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500">
                    {student.data_criacao && student.data_criacao !== "0000-00-00 00:00:00"
                      ? new Date(student.data_criacao).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell className="px-5 py-4 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver"
                    >
                      <EyeCloseIcon size={18} />
                    </button>

                    <Link href={`/table-student/${student.id}`}>
                      <button
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Editar"
                      >
                        ✏️
                      </button>
                    </Link>

                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
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
