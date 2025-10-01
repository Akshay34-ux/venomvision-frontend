// src/components/ui/badge.tsx
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "success" | "warning";
  className?: string;
}

const styles = {
  default: "bg-gray-100 text-gray-800 border border-gray-200",
  destructive: "bg-red-100 text-red-800 border border-red-200",
  outline: "border border-gray-300 text-gray-600",
  secondary: "bg-blue-100 text-blue-800 border border-blue-200",
  success: "bg-green-100 text-green-800 border border-green-300",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-medium rounded-full",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}