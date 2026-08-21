"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/lib/utils";

export function LogoutButton({
  variant="secondary",
  size,
  className="bg-transparent",
}: React.ComponentProps<typeof Button>) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button variant={variant} size={size} className={cn("cursor-pointer",className)} onClick={logout}>
      Logout
    </Button>
  );
}