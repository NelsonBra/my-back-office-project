import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | ISPAJ - Backoffice Académico",
  description: "Acesso ao Sistema de Gestão Académica do Instituto Superior Politécnico Alvorecer da Juventude",
};

export default function SignIn() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — building image */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col overflow-hidden">
        {/* Building photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7e2410] via-[#c4320a] to-[#fb6514]">
          <Image
            src="/images/ispaj/principal.jpeg"
            alt="ISPAJ — Instituto Superior Politécnico Alvorecer da Juventude"
            fill
            className="object-cover mix-blend-overlay opacity-60"
            priority
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/3 -right-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        {/* Top logo */}
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2">
              <GraduationCap size={20} className="text-orange-300 flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-sm leading-tight">ISPAJ</p>
                <p className="text-white/60 text-xs">Backoffice Académico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 mt-auto p-8 pb-10">
          {/* Sun watermark */}
          <div className="absolute right-8 bottom-28 opacity-10 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="20" fill="white" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <rect
                  key={angle}
                  x="48" y="6" width="4" height="20" rx="2"
                  fill="white"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
            </svg>
          </div>

          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full mb-4">
              <GraduationCap size={12} />
              Sistema de Gestão Académica
            </span>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
              Instituto Superior<br />
              Politécnico<br />
              <span className="text-orange-300">Alvorecer da Juventude</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Plataforma de gestão académica integrada para estudantes, docentes e funcionários do ISPAJ.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <MapPin size={12} />
              <span>Angola</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Phone size={12} />
              <span>Contacte a secretaria para suporte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-gray-900">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-50 flex items-center justify-center">
            <Image src="/images/logo/image.png" alt="ISPAJ" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">ISPAJ</p>
            <p className="text-xs text-gray-500">Backoffice Académico</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <SignInForm />
          </div>
        </div>

        <div className="px-6 py-4 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} ISPAJ — Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
