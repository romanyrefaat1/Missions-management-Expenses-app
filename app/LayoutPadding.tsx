"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function LayoutPadding({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/sign-up";

  return (
    <div
      id="first-div-inside-body"
      className={cn(
        "w-full min-w-0",
        isAuthPage
          ? "p-0"
          : "px-6 pb-8 sm:px-10 lg:px-16"
      )}
    >
      {children}
    </div>
  );
}