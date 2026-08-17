// src/components/ui/toast.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface ToastProps {
  /** Title of the toast */
  title?: string;
  /** Message body */
  description?: string;
  /** Duration in ms before auto dismiss (default 4000) */
  duration?: number;
  /** Callback when toast is dismissed */
  onClose?: () => void;
}

/**
 * A minimal toast component that slides in from the top‑right and auto‑dismisses.
 * It uses Tailwind utilities for styling and the `lucide-react` X icon for close.
 */
export const Toast: React.FC<ToastProps> = ({ title, description, duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  // Notify parent when hidden after animation
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => onClose?.(), 300); // allow fade‑out
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-xs w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg border border-gray-700 p-4 flex items-start space-x-3 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        {description && <p className="text-sm opacity-80">{description}</p>}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-1 rounded hover:bg-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <X size={16} className="text-gray-400" />
      </button>
    </div>
  );
};
