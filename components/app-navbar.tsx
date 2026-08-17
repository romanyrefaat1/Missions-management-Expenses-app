"use client";

import {
  House,
  PlusCircle,
  Navigation,
  MessageSquare,
  Menu,
  ListChecks,
} from "lucide-react";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/home",
    label: "Home",
    icon: House,
  },
  {
    href: "/missions",
    label: "Missions",
    icon: ListChecks,
  },
  {
    href: "/new-mission",
    label: "New Mission",
    icon: PlusCircle,
  },
  {
    href: "/on-the-go",
    label: "On the Go",
    icon: Navigation,
  },
  {
    href: "/feedback",
    label: "Feedback",
    icon: MessageSquare,
  },
];

export default function AppNavbar() {
    const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }
  return (
    <nav className="mb-6 w-full">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/home"
          className="text-lg font-semibold tracking-tight"
        >
          Missiono
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon
                className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                strokeWidth={1.8}
              />
              {label}
            </Link>
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

          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle>Missiono</SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <SheetClose asChild key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon
                      className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                      strokeWidth={1.8}
                    />
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}