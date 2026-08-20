"use client";

import {
  PlusCircle,
  Menu,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { AuthButtonClient } from "./auth-button-client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

const links = [
  {
    href: "/home",
    label: "Home",
    // icon: House,
  },
  // {
  //   href: "/missions",
  //   label: "Missions",
  //   icon: ListChecks,
  // },
  {
    href: "/new-mission",
    label: "New Mission",
    icon: PlusCircle,
  },
  {
    button: <ThemeSwitcher />,
    // icon: PlusCircle,
  },
  {
    button: <AuthButtonClient style="sheet"/>,
    icon: PlusCircle,
  },
  // {
  //   href: "/on-the-go",
  //   label: "On the Go",
  //   icon: Navigation,
  // },
  // {
  //   href: "/feedback",
  //   label: "Feedback",
  //   icon: MessageSquare,
  // },
];

export default function AppNavbar() {
    const pathname = usePathname();
    const {resolvedTheme: theme} = useTheme()
    const [mounted, setMounted] = useState(false);

    // Avoid SSR/client hydration mismatch on theme-dependent logo
    useEffect(() => {
      setMounted(true);
    }, []);

  if (pathname === "/" || pathname === "/auth/login" || pathname === "/auth/sign-up") {
    return null;
  }

  const logoSrc =
    !mounted || theme === "light"
      ? "/logo-dark-text-no-bg.png"
      : "/logo-light-text-no-bg.png";

      const LOGO_ASPECT = 460 / 97; // width / height of the cropped PNG

  const navLinks = links.filter((link) => !link.button);
  const navButtons = links.filter((link) => link.button);

  return (
    <nav className="mb-6 w-full">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
<Image
  src={logoSrc}
  alt="Missiono"
  width={20 * LOGO_ASPECT}
  height={40}
  priority
/>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }, index) => (
            <Link
              key={index}
              href={href!}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {Icon && (
                <Icon
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                  strokeWidth={1.8}
                />
              )}
              {label}
            </Link>
          ))}

          {navLinks.length > 0 && navButtons.length > 0 && (
            <div className="mx-2 h-6 w-px bg-border" aria-hidden="true" />
          )}

          {navButtons.map(({ button }, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-[280px] flex-col sm:w-[320px]"
          >
            <SheetHeader>
              <SheetTitle asChild>
                <Image
                  src={logoSrc}
                  alt="Missiono"
                  width={120}
                  height={32}
                  priority
                />
              </SheetTitle>
            </SheetHeader>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }, index) => (
                <SheetClose asChild key={index}>
                  <Link
                    href={href!}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {Icon && (
                      <Icon
                        className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                        strokeWidth={1.8}
                      />
                    )}
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </div>

            {/* Buttons — pinned to the bottom of the sheet */}
            {navButtons.length > 0 && (
              <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
                {navButtons.map(({ button }, index) => (
                  <div key={index} className="flex w-full items-center">
                    {button}
                  </div>
                ))}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}