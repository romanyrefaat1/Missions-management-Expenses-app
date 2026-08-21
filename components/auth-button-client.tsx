"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { useSession } from "@/contexts/session-context";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonVariantProp = {
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export function AuthButtonClient({
  style,
  buttonVariant,
  isLogoutRoute = true
}: {
  style?: "sheet" | null;
  buttonVariant?: {
    logout?: ButtonVariantProp;
    signUp?: ButtonVariantProp;
    login?: ButtonVariantProp;
  };
  isLogoutRoute?: boolean
}) {
  const { loading, session, error } = useSession();

  const user = session?.user;

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 text-sm text-muted-foreground",
          style === "sheet" && "w-full justify-center py-2"
        )}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 text-sm text-destructive-text",
          style === "sheet" && "w-full justify-center py-2"
        )}
      >
        Something went wrong
      </div>
    );
  }

  return user ? (
    <div className={cn("flex items-center gap-4", style === "sheet" && "w-full")}>
      <LogoutButton
        variant={buttonVariant?.logout?.variant}
        size={buttonVariant?.logout?.size}
        isLogoutRoute={isLogoutRoute}
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex gap-2",
        style === "sheet" && "w-full flex-col gap-2"
      )}
    >
      <Button
        asChild
        size={buttonVariant?.login?.size ?? "sm"}
        variant={buttonVariant?.login?.variant ?? "outline"}
        className={cn(style === "sheet" && "w-full")}
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button
        asChild
        size={buttonVariant?.signUp?.size ?? "sm"}
        variant={buttonVariant?.signUp?.variant ?? "default"}
        className={cn(style === "sheet" && "w-full")}
      >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}