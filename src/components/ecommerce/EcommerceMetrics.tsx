"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {

  const [studentsTotal, setStudentsTotal] = useState<number>(0);
  const [studentsPercentage, setStudentsPercentage] = useState<number>(0);
  const [paymentsTotal, setPaymentsTotal] = useState<number>(0);
  const [paymentsPercentage, setPaymentsPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadMetrics = async () => {
      try {

        const studentsRes = await fetch("http://localhost:3000/students");
        const studentsData = await studentsRes.json();
        setStudentsTotal(studentsData.total_students ?? 0);
        setStudentsPercentage(studentsData.percentage ?? 0);


        const paymentsRes = await fetch("http://localhost:3000/payments");
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Estudantes
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "—" : studentsTotal?.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
             {studentsPercentage >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(studentsPercentage).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pagamentos
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "—" : paymentsTotal?.toLocaleString()}
            </h4>
          </div>

          <Badge color="error">
           {paymentsPercentage >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(paymentsPercentage).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
