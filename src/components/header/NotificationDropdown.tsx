"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { io } from "socket.io-client";

type PaymentNotification = {
  student_id: number;
  value_paid: number;
  payment_number: string;
  message: string;
};


export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const socket = io("http://localhost:3000");

  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [newAlert, setNewAlert] = useState(false);

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    socket.on("new_payment", (data: PaymentNotification) => {
      setNotifications((prev) => [data, ...prev]);
      setNewAlert(true);
    });

    return () => {
      socket.off("new_payment");
    };
  }, []);


  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="relative">
      {/* Botão do sino */}
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {/* Indicador de notificação */}
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-80 max-h-[480px] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notificações
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Lista de notificações */}
        <ul className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {notifications.length === 0 ? (
            <li className="text-gray-500 text-sm text-center">Nenhuma notificação</li>
          ) : (
            notifications.map((n, i) => (
              <li
                key={i}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
              >
                <span>{n.message}</span>
                <button
                  onClick={() => removeNotification(i)}
                  className="text-red-400 hover:text-red-600 text-sm font-bold"
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Link para ver todas */}
        <Link
          href="/"
          className="block text-center text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg mx-4 my-2 py-2 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          Ver todas notificações
        </Link>
      </Dropdown>
    </div>
  );

}
