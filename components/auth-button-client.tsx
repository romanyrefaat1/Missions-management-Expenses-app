"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { useSession } from "@/contexts/session-context";
import { cn } from "@/lib/utils";

export function AuthButtonClient({style}: {style: "sheet" | null}) {
  const { loading, session, error } = useSession();

  const user = session?.user;

  if (loading) {
    return <div className="flex items-center gap-4 text-sm text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center gap-4 text-sm text-destructive">Something went wrong</div>;
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className={cn("flex gap-2", style === "sheet" && "flex-col bg-red-500 w-full")}>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}