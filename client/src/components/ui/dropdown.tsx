// src/components/ui/dropdown.tsx
import * as React from 'react';
import { cn } from '../../utils/cn';

export const Dropdown = ({ children }: { children: React.ReactNode }) => (
  <div className={cn('relative inline-block')}>{children}</div>
);

export const DropdownTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('inline-flex items-center justify-center rounded-md border border-input bg-background p-2', className)}
      {...props}
    />
  )
);
DropdownTrigger.displayName = 'DropdownTrigger';

export const DropdownContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('absolute mt-2 w-56 rounded-md bg-background shadow-lg', className)}
      {...props}
    />
  )
);
DropdownContent.displayName = 'DropdownContent';
