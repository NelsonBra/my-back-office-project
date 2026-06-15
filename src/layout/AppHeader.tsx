"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        inputRef.current?.blur();
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-[99999] dark:border-gray-800 dark:bg-gray-900 shadow-sm">
      <div className="flex items-center justify-between w-full px-3 py-2 lg:px-6 lg:py-0 gap-3">

        {/* Left: Toggle + Mobile Logo */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            {isMobileOpen ? (
              <X size={20} />
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path
                  d="M1 1H17M1 7H17M1 13H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* Mobile: ISPAJ branding */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-50 flex items-center justify-center">
              <Image
                src="/images/logo/image.png"
                alt="ISPAJ"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="hidden xsm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">ISPAJ</p>
              <p className="text-xs text-gray-500 leading-tight">Backoffice</p>
            </div>
          </Link>

          {/* Desktop: Search Bar */}
          <div className="hidden lg:block">
            <div className={`relative transition-all duration-200 ${isSearchFocused ? "w-80" : "w-64"}`}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Pesquisar..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-14 text-sm text-gray-800
                  placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10
                  focus:bg-white transition-all duration-200
                  dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-gray-500
                  dark:focus:border-brand-600 dark:focus:bg-gray-800"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <span>⌘</span><span>K</span>
              </kbd>
            </div>
          </div>
        </div>

        {/* Desktop: Institution Name */}
        <div className="hidden lg:flex items-center gap-3 flex-1 justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">
              Instituto Superior Politécnico Alvorecer da Juventude
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Sistema de Gestão Académica</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="More options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm-2 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>

      {/* Mobile expanded menu */}
      {isApplicationMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3 lg:hidden shadow-md">
          {/* Mobile search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800
                placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10
                dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-gray-500"
            />
          </div>
          <ThemeToggleButton />
          <NotificationDropdown />
        </div>
      )}
    </header>
  );
};

export default AppHeader;
