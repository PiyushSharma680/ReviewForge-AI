// src/components/ui/modal.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * A lightweight modal component with dark backdrop and smooth fade/scale transition.
 * It uses Tailwind CSS utilities for styling and animations.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal panel */}
      <div className="relative bg-gray-900 rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 transform transition-all duration-200 scale-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-800 focus:outline-none"
          aria-label="Close"
        >
          <X size={20} className="text-gray-400" />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-100">{title}</h2>}
        <div className="text-gray-200">{children}</div>
      </div>
    </div>
  );
};
