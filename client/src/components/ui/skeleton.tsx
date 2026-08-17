// src/components/ui/skeleton.tsx
import React from "react";

export interface SkeletonProps {
  /** Width of the skeleton block (e.g., "100%" or "200px") */
  width?: string | number;
  /** Height of the skeleton block */
  height?: string | number;
  /** Border radius for rounded corners */
  borderRadius?: string | number;
  /** Additional Tailwind classes */
  className?: string;
}

/**
 * Simple skeleton (shimmer) placeholder for loading states.
 * Uses a CSS gradient animation to create a subtle shimmer effect.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  borderRadius = "0.25rem",
  className = "",
}) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    background:
      "linear-gradient(90deg, rgba(71,71,71,0.2) 0%, rgba(115,115,115,0.4) 50%, rgba(71,71,71,0.2) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  return <div style={style} className={className} />;
};

// Add keyframes for shimmer animation (global styles can be placed in globals.css)
// If you prefer to keep them here, you can use a <style jsx> block in Next.js, but it's recommended
// to add the following to your CSS:
/*
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
*/
