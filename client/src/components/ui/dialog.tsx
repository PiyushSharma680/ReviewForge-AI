// src/components/ui/dialog.tsx
import * as React from 'react';
import { cn } from '../../utils/cn';

export const Dialog = ({ open, children }: { open: boolean; onOpenChange?: (isOpen: boolean) => void; children: React.ReactNode }) => (
  open ? <div>{children}</div> : null
);

export const DialogTrigger = ({ children }: { asChild?: boolean; children: React.ReactNode }) => (
  <span>{children}</span>
);

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg bg-background p-6 shadow-lg', className)}
      {...props}
    />
  )
);
DialogContent.displayName = 'DialogContent';
