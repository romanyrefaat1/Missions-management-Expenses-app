"use client";

import * as React from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";

import CompletedToggleButton from "./completed-toggle-button";

type CompletedToggleProps = {
  isCompleted: boolean;
  onCompletedChange: (isCompleted: boolean) => void;
  disabled?: boolean;
};

export function CompletedToggle({
  isCompleted,
  onCompletedChange,
  disabled = false,
}: CompletedToggleProps) {
  return (
    <Field orientation="horizontal" className="rounded-xl border p-4">
      <FieldContent>
        <FieldTitle>Completed</FieldTitle>

        <FieldDescription>Mark this task as completed.</FieldDescription>
      </FieldContent>

      <CompletedToggleButton
        isCompleted={isCompleted}
        onCompletedChange={onCompletedChange}
        disabled={disabled}
      />
    </Field>
  );
}
