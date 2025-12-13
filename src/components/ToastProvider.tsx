"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
   <ToastContainer
      position="top-right"
      autoClose={3000}
      style={{
        marginTop: "80px", // ↓ move toast farther down
        zIndex: 999999,
      }}
    />
  );
}
