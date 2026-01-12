import React from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmação",
    message = "Deseja realmente validar este pagamento?",
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>

                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                            if (typeof onConfirm === "function") {
                                onConfirm();
                            }
                            onClose();
                        }}
                    >
                        Validar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
