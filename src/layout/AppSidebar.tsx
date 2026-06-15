"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  UserCircle,
  ClipboardList,
  TableProperties,
  ScrollText,
  BookOpen,
  UserPlus,
  LogIn,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    subItems: [{ name: "Estatísticas", path: "/", pro: false }],
  },
  {
    icon: <CalendarDays size={20} />,
    name: "Calendário",
    path: "/calendar",
  },
  {
    icon: <Clock size={20} />,
    name: "Momentos",
    path: "/momment",
  },
  {
    icon: <UserCircle size={20} />,
    name: "Perfil",
    path: "/profile",
  },
  {
    name: "Formulários",
    icon: <ClipboardList size={20} />,
    subItems: [
      { name: "Estudantes", path: "/student-form", pro: false },
      { name: "Pagamento", path: "/payment-form", pro: false },
    ],
  },
  {
    name: "Listagens",
    icon: <TableProperties size={20} />,
    subItems: [
      { name: "Pagamentos", path: "/table-payment", pro: false },
      { name: "Inscritos", path: "/table-users", pro: false },
      { name: "Matriculados", path: "/table-student", pro: false },
      { name: "Momentos", path: "/listMoment", pro: false },
    ],
  },
  {
    icon: <ScrollText size={20} />,
    name: "Regulamentos",
    subItems: [
      { name: "Inserir", path: "/regulament", pro: false },
      { name: "Listar", path: "/listRegulament", pro: false },
    ],
  },
  {
    name: "Académico",
    icon: <BookOpen size={20} />,
    subItems: [
      { name: "Horários de Aulas", path: "/horarios", pro: false },
      { name: "Calendário de Provas", path: "/calendario-provas", pro: false },
    ],
  },
  {
    name: "Inscrições",
    icon: <UserPlus size={20} />,
    subItems: [
      { name: "Inscrever Aluno", path: "/blank", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <LogIn size={20} />,
    name: "Autenticação",
    subItems: [
      { name: "Login", path: "/signin", pro: false },
      { name: "Inscrição", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const isVisible = isExpanded || isHovered || isMobileOpen;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const hasActiveChild = nav.subItems?.some((s) => isActive(s.path));

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isOpen || hasActiveChild
                    ? "bg-brand-500/15 text-brand-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }
                  ${!isVisible ? "lg:justify-center" : ""}
                `}
              >
                <span className={`flex-shrink-0 ${isOpen || hasActiveChild ? "text-brand-400" : "text-gray-500"}`}>
                  {nav.icon}
                </span>
                {isVisible && (
                  <>
                    <span className="flex-1 text-left">{nav.name}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-400" : "text-gray-600"}`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(nav.path)
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                    ${!isVisible ? "lg:justify-center" : ""}
                  `}
                >
                  <span className={`flex-shrink-0 ${isActive(nav.path) ? "text-white" : "text-gray-500"}`}>
                    {nav.icon}
                  </span>
                  {isVisible && <span>{nav.name}</span>}
                </Link>
              )
            )}

            {nav.subItems && isVisible && (
              <div
                ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px",
                }}
              >
                <ul className="mt-1 ml-3 pl-3 border-l border-gray-700/50 space-y-0.5 py-1">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${isActive(subItem.path)
                            ? "bg-brand-500/20 text-brand-400 font-medium"
                            : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                          }
                        `}
                      >
                        <ChevronRight size={12} className={isActive(subItem.path) ? "text-brand-400" : "text-gray-600"} />
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 h-screen
        bg-[#111827] border-r border-gray-800
        transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen ? "w-[272px]" : isHovered ? "w-[272px]" : "w-[80px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo / Brand Area */}
      <div className={`flex items-center border-b border-gray-800 px-4 py-5 ${!isVisible ? "lg:justify-center" : ""}`}>
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-brand-500/10 flex items-center justify-center">
            <Image
              src="/images/logo/image.png"
              alt="ISPAJ"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          {isVisible && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">ISPAJ</p>
              <p className="text-gray-500 text-xs whitespace-nowrap">Backoffice Académico</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3">
        <nav className="space-y-6">
          {/* Main Menu */}
          <div>
            {isVisible ? (
              <p className="text-xs font-semibold uppercase text-gray-600 px-3 mb-3 tracking-widest">
                Menu Principal
              </p>
            ) : (
              <div className="flex justify-center mb-3 text-gray-700">
                <HorizontaLDots />
              </div>
            )}
            {renderMenuItems(navItems, "main")}
          </div>

          {/* Others */}
          <div>
            {isVisible ? (
              <p className="text-xs font-semibold uppercase text-gray-600 px-3 mb-3 tracking-widest">
                Sistema
              </p>
            ) : (
              <div className="flex justify-center mb-3 text-gray-700">
                <HorizontaLDots />
              </div>
            )}
            {renderMenuItems(othersItems, "others")}
          </div>
        </nav>
      </div>

      {/* Footer */}
      {isVisible && (
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={16} className="text-brand-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-gray-400 whitespace-nowrap truncate">Alvorecer da Juventude</p>
              <p className="text-xs text-gray-600">© {new Date().getFullYear()} ISPAJ</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
