"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { AcademicYear, Course, Person, StudentFormData, } from "@/types";
import { toast } from "react-toastify";

type Props = {
  data?: Person;
};

export default function UserInfoCard({ data }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [courses, setCourses] = useState<Course[]>([]);
  // const [academicYear, setAcademicYear] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nif: "",
    morada: "",
    academicYear: "",
    courseId: "",
    courseName: "",
  });





  useEffect(() => {
    fetch("http://localhost:3000/academic-years")
      .then(res => res.json())
      .then(data => {
        setAcademicYears(data.data);
      })
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:3000/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    fetchCourses();
  }, []);




  useEffect(() => {
    if (isOpen && data) {
      const [firstName, ...rest] = data.nome.split(" ");

      setFormData({
        firstName,
        lastName: rest.join(" "),
        email: data.email ?? "",
        phone: data.telemovel ?? "",
        nif: data.nif ?? "",
        morada: data.morada ?? "",
        academicYear: data?.academic_year?.toString() ?? "",
        courseId: data?.course_id?.toString() ?? "",
        courseName: data?.course_name ?? "",
      });
    }
  }, [isOpen, data]);




  const handleSave = async () => {
    try {
      const payload = {
        nome: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        telemovel: formData.phone,
        nif: formData.nif,
        morada: formData.morada,
        academic_year: formData.academicYear
          ? Number(formData.academicYear)
          : null,

        course_id: Number(formData.courseId),
      };


      const res = await fetch(`http://localhost:3000/students/${data?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update student");
      }


      toast.success("Estudante atualizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Close modal after a delay (matches toast duration)
      // setTimeout(() => {
      //   closeModal();
      // }, 3000);

    } catch (err) {
      console.error(err);
      toast.success("Erro ao atualizar estudante");
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  if (!data) {
    return (
      <div className="p-5 border rounded-2xl">
        <p className="text-sm text-gray-500">Loading personal information...</p>
      </div>
    );
  }

  const [firstName, ...rest] = data.nome.split(" ");
  const lastName = rest.join(" ");
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Informação pessoal
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">

                <div>
                  <p className="mb-2 text-xs text-gray-500">Nome</p>
                  <p className="text-sm font-medium">{firstName || "—"}</p>
                </div>


                <div>
                  <p className="mb-2 text-xs text-gray-500">Sobrenome</p>
                  <p className="text-sm font-medium">{lastName || "—"}</p>
                </div>


                <div>
                  <p className="mb-2 text-xs text-gray-500">Email </p>
                  <p className="text-sm font-medium">{data.email ?? "—"}</p>
                </div>


                <div>
                  <p className="mb-2 text-xs text-gray-500">Telefone</p>
                  <p className="text-sm font-medium">{data.telemovel ?? "—"}</p>
                </div>


                <div>
                  <p className="mb-2 text-xs text-gray-500">BI</p>
                  <p className="text-sm font-medium">{data.nif ?? "—"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500">Morada</p>
                  <p className="text-sm font-medium">{data.morada ?? "—"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500">Ano Acadêmico</p>
                  <p className="text-sm font-medium"> {data?.academic_year ?? "—"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500">Curso</p>
                  <p className="text-sm font-medium"> {data?.course_name ?? "—"}</p>
                </div>
              </div>
            </div>


          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">

          <form className="flex flex-col" >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">


              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informações pessoais
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                  <div>
                    <Label>Nome</Label>
                    <Input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Sobrenome</Label>
                    <Input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Telefone</Label>
                    <Input
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}

                    />
                  </div>

                  <div>
                    <Label>BI / NIF</Label>
                    <Input
                      name="nif"
                      type="text"
                      value={formData.nif}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Morada</Label>
                    <Input
                      name="morada"
                      type="text"
                      value={formData.morada}
                      onChange={handleChange}

                    />
                  </div>

                  <div>
                    <Label>Ano Acadêmico</Label>
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleSelectChange}
                      required
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                    >
                      <option value="">Selecione o ano académico</option>
                      {academicYears.map(year => (
                        <option key={year.id} value={year.id}>
                          {year.name}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div>
                    <Label>Curso</Label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleSelectChange}
                      className="w-full rounded border p-2"
                    >
                      <option value="">Selecione o curso</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.nome}
                        </option>
                      ))}
                    </select>
                  </div>




                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
