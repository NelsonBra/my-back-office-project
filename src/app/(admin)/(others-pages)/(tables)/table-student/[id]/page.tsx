
import { Person } from "@/types";
import Profile from "../../../profile/page";

type PageProps = {
  params: { id: string };
};

async function getStudent(id: string): Promise<Person> {
  const res = await fetch(`http://localhost:3000/students/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch student");
  }

  return res.json();
}

export default async function StudentProfilePage({ params }: PageProps) {
  const student = await getStudent(params.id);

  return <Profile data={student} />;
}
