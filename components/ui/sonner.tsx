"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-emerald-500" />
        ),
        info: (
          <InfoIcon className="size-4 text-muted-foreground" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group/toast font-body !rounded-xl !border !shadow-lg !backdrop-blur-sm",

          title:
            "font-body !text-sm !font-semibold !leading-5 !tracking-tight",

          description:
            "font-body !text-sm !leading-5",

          actionButton:
            "!rounded-lg !bg-primary !px-3 !font-body !text-xs !font-semibold !text-primary-foreground",

          cancelButton:
            "!rounded-lg !bg-muted !font-body !text-xs !font-medium",

          closeButton:
            "!rounded-lg !border-border/60 !bg-transparent !text-muted-foreground hover:!bg-muted",

          success: [
            "!border-emerald-500/30",
            "!bg-emerald-500/10",
            "!text-emerald-950",
            "dark:!text-emerald-100",
          ].join(" "),

          info: [
            "!border-border",
            "!bg-card",
            "!text-card-foreground",
          ].join(" "),

          warning: [
            "!border-amber-500/30",
            "!bg-amber-500/10",
            "!text-amber-950",
            "dark:!text-amber-100",
          ].join(" "),

          error: [
            "!border-red-500/30",
            "!bg-red-500/10",
            "!text-red-950",
            "dark:!text-red-100",
          ].join(" "),

          loading: [
            "!border-border",
            "!bg-muted/50",
            "!text-foreground",
          ].join(" "),
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };