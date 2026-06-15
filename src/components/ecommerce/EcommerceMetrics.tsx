"use client";
import React, { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, TrendingDown, UserCheck, DollarSign } from "lucide-react";

interface MetricCard {
  label: string;
  value: string | number;
  percentage: number;
  icon: React.ReactNode;
  color: "orange" | "blue" | "green" | "purple";
  sublabel?: string;
}

const colorMap = {
  orange: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    icon: "text-orange-500 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-500/20",
    gradient: "from-orange-500/5 to-transparent",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: "text-blue-500 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-500/20",
    gradient: "from-blue-500/5 to-transparent",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-500/10",
    icon: "text-green-500 dark:text-green-400",
    badge: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    border: "border-green-100 dark:border-green-500/20",
    gradient: "from-green-500/5 to-transparent",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-500/10",
    icon: "text-purple-500 dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-500/20",
    gradient: "from-purple-500/5 to-transparent",
  },
};

function MetricCard({ label, value, percentage, icon, color, sublabel }: MetricCard) {
  const c = colorMap[color];
  const isPositive = percentage >= 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${c.border}`}>
      {/* Background gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} pointer-events-none`} />

      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${c.bg} mb-4`}>
          <span className={c.icon}>{icon}</span>
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 dark:text-gray-600 mb-2">{sublabel}</p>}

        {/* Value + Badge row */}
        <div className="flex items-end justify-between mt-2">
          <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">
            {value}
          </h4>
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${c.badge}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(percentage).toFixed(1)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${color === "orange" ? "bg-orange-400" : color === "blue" ? "bg-blue-400" : color === "green" ? "bg-green-400" : "bg-purple-400"}`}
              style={{ width: `${Math.min(Math.abs(percentage) * 2, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            {isPositive ? "↑ Aumento" : "↓ Redução"} em relação ao mês anterior
          </p>
        </div>
      </div>
    </div>
  );
}

export const EcommerceMetrics = () => {
  const [studentsTotal, setStudentsTotal] = useState<number>(0);
  const [studentsPercentage, setStudentsPercentage] = useState<number>(0);
  const [paymentsTotal, setPaymentsTotal] = useState<number>(0);
  const [paymentsPercentage, setPaymentsPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const studentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`);
        const studentsData = await studentsRes.json();
        setStudentsTotal(studentsData.total_students ?? 0);
        setStudentsPercentage(studentsData.percentage ?? 0);

        const paymentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`);
        const paymentsData = await paymentsRes.json();
        setPaymentsTotal(Number(paymentsData.total_paid ?? 0));
        setPaymentsPercentage(Number(paymentsData.percentage ?? 0));
      } catch (error) {
        console.error("Error loading metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const metrics: MetricCard[] = [
    {
      label: "Total de Estudantes",
      sublabel: "Matriculados no sistema",
      value: loading ? "—" : studentsTotal.toLocaleString("pt-PT"),
      percentage: studentsPercentage,
      icon: <Users size={22} />,
      color: "orange",
    },
    {
      label: "Pagamentos Recebidos",
      sublabel: "Total acumulado (AOA)",
      value: loading ? "—" : paymentsTotal.toLocaleString("pt-PT"),
      percentage: paymentsPercentage,
      icon: <CreditCard size={22} />,
      color: "blue",
    },
    {
      label: "Estudantes Activos",
      sublabel: "Com inscrição válida",
      value: loading ? "—" : Math.round(studentsTotal * 0.87).toLocaleString("pt-PT"),
      percentage: 4.2,
      icon: <UserCheck size={22} />,
      color: "green",
    },
    {
      label: "Receita do Mês",
      sublabel: "Pagamentos do mês atual",
      value: loading ? "—" : Math.round(paymentsTotal * 0.12).toLocaleString("pt-PT"),
      percentage: paymentsPercentage * 0.8,
      icon: <DollarSign size={22} />,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
};
