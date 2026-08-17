// src/components/ui/spinner.tsx
import React from "react";

export interface SpinnerProps {
  /** Size of the spinner (e.g., "1rem", "24px") */
  size?: string | number;
  /** Tailwind color class (e.g., "text-purple-500") */
  colorClass?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Simple SVG spinner with a rotating animation.
 * Uses Tailwind utilities for sizing & color, and a CSS animation defined inline.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "1.5rem",
  colorClass = "text-purple-500",
  className = "",
}) => {
  const dimension = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      className={`${colorClass} ${className}`}
      width={dimension}
      height={dimension}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="90 150"
        strokeDashoffset="-35"
      />
    </svg>
  );
};

// Add CSS for spin animation (can be placed in globals.css as well)
// If not added globally, the inline style above will work.
