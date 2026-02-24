import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return <input type="checkbox" className={cn("h-4 w-4 rounded border-border text-primary focus:ring-ring", className)} {...props} />;
}
