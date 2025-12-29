"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "../../ui/badge/Badge";
import { EyeCloseIcon } from "@/icons";


interface User {
  id: number;
  nome: string;
  email: string;
  type_user: "cliente" | "admin" | "staff";
  status?: "active" | "inactive";
  data_criacao: string;
}

export default function UserTable() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:3000/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Error loading users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-gray-500 px-5 py-4">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500 px-5 py-4">{error}</p>;
  }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/10">
              <TableRow>
                {["ID", "Nome", "Email", "Tipo", "Status", "Criado em", "Ações"].map(
                  (title) => (
                    <TableCell
                      key={title}
                      isHeader
                      className="px-5 py-3 text-gray-500 font-medium text-theme-xs"
                    >
                      {title}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <TableCell className="px-5 py-4">{user.id}</TableCell>

                  <TableCell className="px-5 py-4 font-medium">
                    {user.nome}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {user.email}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <Badge
                      size="sm"
                      color={
                        user.type_user === "admin"
                          ? "error"
                          : user.type_user === "staff"
                            ? "warning"
                            : "success"
                      }
                    >
                      {user.type_user}
                    </Badge>


                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <Badge
                      size="sm"
                      color={user.status === "active" ? "success" : "error"}
                    >
                      {user.status ?? "active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500">
                    {new Date(user.data_criacao).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="px-5 py-4 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver"
                    >
                      <EyeCloseIcon size={18} />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Editar"
                    >
                      ✏️
                    </button>

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
