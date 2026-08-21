"use client";

import { PlusCircle, Menu, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthButtonClient } from "./auth-button-client";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import Logo from "./logo";

const links = [
  {
    href: "/home",
    label: "Home",
    icon: House,
  },
  {
    href: "/new-mission",
    label: "New Mission",
    icon: PlusCircle,
  },
  {
    button: <ThemeSwitcher isText={true}/>,
  },
  {
    button: <AuthButtonClient style="sheet" />,
  },
];

export default function AppNavbar() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/auth/login" || pathname === "/auth/sign-up") {
    return null;
  }

  const navLinks = links.filter((link) => !link.button);
  const navButtons = links.filter((link) => link.button);

  return (
    <nav className="mb-6 w-full">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo href="/home" />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }, index) => {
            const isActive = pathname === href;
            return (
              <Link
                key={index}
                href={href!}
                className={cn(
                  "group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                {Icon && (
                  <Icon
                    className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                    strokeWidth={1.8}
                  />
                )}
                {label}
              </Link>
            );
          })}

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
            className="flex w-[280px] flex-col p-6 sm:w-[320px]"
          >
            <SheetHeader className="text-left">
              <SheetTitle>
                <Logo href="/home" />
              </SheetTitle>
            </SheetHeader>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }, index) => {
                const isActive = pathname === href;
                return (
                  <SheetClose asChild key={index}>
                    <Link
                      href={href!}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                      )}
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
                );
              })}
            </div>

            {/* Buttons pinned to bottom */}
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