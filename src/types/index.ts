import { PaymentMethod, PaymentStatus } from "@/enum";

export interface PaymentFormData {
  user_id: string;
  nome: string;
  email: string;
  value_paid: string;
  course_id: string;
  fee_type_id: string;
  method_payment: PaymentMethod;
  status: PaymentStatus;
  data_payment: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
}


export interface Course {
  id: number;
  nome: string;
  descricao?: string;
}


export type CourseFee = {
  fee_type_id: number;
  fee_type_name: string;
  price: number;
  category_id?: number;
  category_name?: string;
};


export interface FeeType {
  id: number;
  nome: string;
  categoria_id?: number;
  category_name?: string;
}

export type ApiPayment = {
  payment_id: number;
  usuario_id: number;
  student_id: number;
  value_paid: string;
  data_payment: string;
  method_payment: PaymentMethod;
  payment_number: string;
  proof: string | null;
  status: PaymentStatus;

  course: {
    course_id: number;
    course_name: string;
  };

  fee_type: {
    fee_type_id: number;
    fee_type_name: string;
  };

  student: {
    student_id: number;
    student_name: string;
  },
};



export interface TablePayment {
  id: number;
  valor: string;
  curso: string;
  servico: string;
  metodo: PaymentMethod;
  status: PaymentStatus;
  data: string;
  studentName: string;
  numero: string;
  comprovativo: string | null;
}

export type Person = {
  id: number;
  nome: string;
  email: string;
  nif?: string;
  telemovel?: string;
  filiacao?: string;
  morada?: string;
  data_nascimento?: string | null;
  role?: string;
  course_name?: string;
  course_id?: string;
  academic_year: number;

  user?: {
    id: number;
    academic_year: number;
  };
};


export type ProfileProps = {
  data: Person;
};

export type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nif: string;
  morada: string;
  academicYear: string | number;
  courseName: string;
  courseId: string;
};

export type AcademicYear = {
  id: number;
  name: string;
};

export interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
}




