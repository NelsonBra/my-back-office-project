"use client";
import React, { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const getFormattedDate = () => {
  return new Date().toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function WelcomeBanner() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(getFormattedDate());
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c4320a] via-[#ec4a0a] to-[#fb6514] p-6 md:p-8 text-white shadow-xl">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -right-8 -bottom-20 w-48 h-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-32 top-4 w-20 h-20 rounded-full bg-white/5" />

      {/* Sun logo watermark */}
      <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden md:block">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="20" fill="white" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <rect
              key={angle}
              x="48"
              y="8"
              width="4"
              height="18"
              rx="2"
              fill="white"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Greeting */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={20} className="text-orange-200" />
            <span className="text-orange-200 text-sm font-medium uppercase tracking-widest">
              Backoffice Académico
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {getGreeting()}, Bem-vindo!
          </h1>
          <p className="text-orange-100 text-sm md:text-base font-medium">
            Instituto Superior Politécnico Alvorecer da Juventude
          </p>
          {date && (
            <p className="text-orange-200/80 text-sm mt-1 capitalize">{date}</p>
          )}
        </div>

        {/* Right: Quick stats pills */}
        <div className="flex flex-wrap gap-3 md:flex-col md:items-end">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <Users size={16} className="text-orange-200" />
            <span className="text-sm font-medium text-white">Gestão de Estudantes</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <BookOpen size={16} className="text-orange-200" />
            <span className="text-sm font-medium text-white">Gestão Académica</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <TrendingUp size={16} className="text-orange-200" />
            <span className="text-sm font-medium text-white">Relatórios & Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
