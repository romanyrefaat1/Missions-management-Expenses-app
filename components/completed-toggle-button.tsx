"use client";

import * as React from "react";

import { Check } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

type CompletedToggleProps = {
  isCompleted: boolean;
  onCompletedChange: (isCompleted: boolean) => void;
  disabled?: boolean;
};

export default function CompletedToggleButton({
  isCompleted,
  onCompletedChange,
  disabled = false,
}: CompletedToggleProps) {
  return (
    <CheckboxPrimitive.Root
      checked={isCompleted}
      onCheckedChange={(checked) => onCompletedChange(checked === true)}
      disabled={disabled}
      className={cn(
        "peer size-6 shrink-0 rounded-full border-2 border-input",
        "transition-all duration-200 ease-out",
        "hover:border-primary/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "data-[state=checked]:scale-110",
      )}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-primary-foreground",
          "data-[state=checked]:animate-in data-[state=checked]:zoom-in-50 data-[state=checked]:duration-300",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}