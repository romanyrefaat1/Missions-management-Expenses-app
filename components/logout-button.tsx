"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LogoutButton() {
  const router = useRouter();

  const logout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Link
      href="/auth/login"
      onClick={logout}
      className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      Logout
    </Link>
  );
}
