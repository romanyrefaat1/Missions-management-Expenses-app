"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  ListChecks,
  Menu,
  MoveDownRight,
  Play,
  Target,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CloudShader } from "@/components/ui/cloud-shader";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButtonClient } from "@/components/auth-button-client";
import { useSession } from "@/contexts/session-context";
import { TextReveal } from "@/components/ui/text-reveal";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { LogoutButton } from "@/components/logout-button";

function ArrowMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 text-primary ${className}`}>
      <span className="text-2xl leading-none">↗</span>
      <span className="text-2xl leading-none">↗</span>
      <span className="text-2xl leading-none">↗</span>
    </div>
  );
}

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      <span className="h-px w-7 bg-primary" />
      {children}
    </div>
  );
}

function MissionCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[3rem] bg-primary/[0.045] blur-3xl" />

      <div className="relative rotate-[1.2deg] rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-transform duration-700 hover:rotate-0 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Mission / 01
            </div>

            <h3 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.035em] text-card-foreground">
              Launch my side project
            </h3>
          </div>

          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary hover:bg-primary/10">
            In progress
          </Badge>
        </div>

        <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground">
          Build and launch something people can actually use.
        </p>

        <div className="mt-7">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Mission progress
            </span>

            <span className="font-semibold text-card-foreground">72%</span>
          </div>

          <Progress value={72} className="mt-2 h-1.5" />
        </div>

        <div className="mt-7 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-muted/40">
          <div className="p-3">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Budget
            </div>

            <div className="mt-1 text-sm font-bold text-card-foreground">
              $600
            </div>
          </div>

          <div className="p-3">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Spent
            </div>

            <div className="mt-1 text-sm font-bold text-card-foreground">
              $420
            </div>
          </div>

          <div className="p-3">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Tasks
            </div>

            <div className="mt-1 text-sm font-bold text-card-foreground">
              8 / 11
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-card-foreground">
              Next steps
            </span>

            <span className="text-[10px] text-muted-foreground">
              3 remaining
            </span>
          </div>

          <div className="space-y-2">
            {[
              ["Define the idea", true, "$0"],
              ["Build the landing page", true, "$80"],
              ["Set up analytics", false, "$24"],
              ["Launch publicly", false, "$120"],
            ].map(([name, done, price]) => (
              <div
                key={name as string}
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "border border-border"
                  }`}
                >
                  {done && <Check className="h-3 w-3" />}
                </div>

                <span
                  className={`flex-1 text-xs ${
                    done
                      ? "text-muted-foreground line-through"
                      : "font-medium text-card-foreground"
                  }`}
                >
                  {name as string}
                </span>

                <span className="text-[10px] font-semibold text-muted-foreground">
                  {price as string}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-[10px] text-muted-foreground">
            Updated just now
          </span>

          <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
            View mission
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 hidden rotate-[-4deg] rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="h-4 w-4" />
          </div>

          <div>
            <div className="text-[9px] text-muted-foreground">
              Completed
            </div>

            <div className="text-xs font-semibold text-card-foreground">
              8 tasks
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-12 hidden rotate-[4deg] rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
          Remaining
        </div>

        <div className="mt-1 text-lg font-bold tracking-tight text-card-foreground">
          $180
        </div>
      </div>
    </div>
  );
}

function TaskFlow() {
  const tasks = [
    ["01", "Define the idea", true, "Name it and mean it"],
    ["02", "Build the landing page", true, "First real step, first real cost"],
    ["03", "Set up analytics", false, "Next"],
    ["04", "Launch publicly", false, "Later"],
  ];

  return (
    <div className="relative">
      <div className="absolute bottom-5 left-5 top-5 w-px bg-border" />

      <div className="space-y-3">
        {tasks.map(([number, name, done, status], index) => (
          <BlurFade
            key={number as string}
            delay={index * 0.12}
            inView
          >
            <div className="relative flex items-center gap-4">
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="font-mono text-[10px]">
                    {number as string}
                  </span>
                )}
              </div>

              <div
                className={`flex flex-1 items-center justify-between rounded-xl border border-border px-4 py-4 ${
                  done ? "bg-muted/30" : "bg-background"
                }`}
              >
                <span
                  className={`text-sm ${
                    done
                      ? "text-muted-foreground line-through"
                      : "font-medium text-foreground"
                  }`}
                >
                  {name as string}
                </span>

                <span className="text-xs text-muted-foreground">
                  {status as string}
                </span>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

function BudgetCard() {
  return (
    <MagicCard
      className="rounded-[1.5rem] border bg-card"
      gradientColor="#3b82f6"
      gradientOpacity={0.07}
    >
      <div className="p-7 sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Mission budget
            </div>

            <div className="mt-2 flex items-baseline">
              <span className="font-heading text-5xl font-semibold tracking-[-0.05em] text-card-foreground">
                $
              </span>

              <NumberTicker
                value={600}
                className="font-heading text-5xl font-semibold tracking-[-0.05em] text-card-foreground"
              />
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Used</span>
            <span className="font-semibold text-card-foreground">70%</span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[70%] rounded-full bg-primary transition-all duration-1000" />
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 divide-x divide-border rounded-xl border border-border">
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Spent
            </div>

            <div className="mt-1 text-xl font-bold tracking-tight text-card-foreground">
              $420
            </div>
          </div>

          <div className="p-4 pl-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Remaining
            </div>

            <div className="mt-1 text-xl font-bold tracking-tight text-card-foreground">
              $180
            </div>
          </div>
        </div>

        <div className="mt-7 divide-y divide-border rounded-xl border border-border">
          {[
            ["Landing page", "$80"],
            ["Domain", "$12"],
            ["Analytics", "$24"],
            ["Marketing", "$120"],
          ].map(([name, price]) => (
            <div
              key={name}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-xs text-muted-foreground">
                {name}
              </span>

              <span className="text-xs font-semibold text-card-foreground">
                {price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MagicCard>
  );
}

function OnTheGo() {
  return (
    <div className="relative mx-auto w-[290px]">
      <div className="absolute -inset-12 rounded-full bg-primary/20 blur-[80px]" />

      <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-2 shadow-2xl">
        <div className="overflow-hidden rounded-[2.1rem] border border-white/10 bg-[#101722]">
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-white/10" />

          <div className="px-5 pb-8 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Mission 01
              </span>

              <span className="text-[10px] text-blue-300">
                3 / 8
              </span>
            </div>

            <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-white">
              Launch my side project
            </h3>

            <div className="mt-5">
              <div className="flex justify-between text-[9px] text-white/35">
                <span>Progress</span>
                <span>38%</span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div className="h-full w-[38%] rounded-full bg-blue-400" />
              </div>
            </div>

            <div className="mt-9 text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-300">
              Current step
            </div>

            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/35">
                  Step 03
                </span>

                <Target className="h-4 w-4 text-blue-300" />
              </div>

              <div className="mt-3 text-base font-semibold text-white">
                Set up analytics
              </div>

              <div className="mt-5 text-[9px] text-white/35">
                Paid price
              </div>

              <div className="mt-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white">
                $24
              </div>

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-300 py-3 text-xs font-bold text-slate-950">
                <Check className="h-3.5 w-3.5" />
                Mark as completed
              </button>
            </div>

            <div className="mt-6 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Up next
            </div>

            <div className="mt-2 rounded-xl border border-white/5 bg-white/[0.025] px-3 py-3 text-xs text-white/60">
              Connect custom domain
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const {session, loading: sessionLoading} = useSession()
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isMobile= useIsMobile()

  // Track dark mode so the hero sky can switch between day/night palettes.
  useEffect(() => {
    const root = document.documentElement;

    const update = () => setIsDark(root.classList.contains("dark"));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* NAV */}
<header className="fixed inset-x-0 top-0 z-50">
  <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
    <nav
      className={`flex h-14 items-center justify-between rounded-2xl border px-3 transition-all duration-300 sm:px-5 ${
        scrolled
          ? "border-border/70 bg-background/90 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="shrink-0 no-underline hover:no-underline"
        onClick={() => setMobileOpen(false)}
      >
        <Logo />
      </Link>

      {/* Desktop navigation */}
      <div className="hidden items-center gap-7 md:flex">
        <Link
          href="#story"
          className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:no-underline"
        >
          The idea
        </Link>

        <Link
          href="#budget"
          className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:no-underline"
        >
          Budget
        </Link>

        <Link
          href="#on-the-go"
          className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:no-underline"
        >
          On The Go
        </Link>

        <ThemeSwitcher isText={true} />
      </div>

      {/* Desktop auth/actions */}
      <div className="hidden items-center gap-2 md:flex">
        {!sessionLoading && (
          <>
            {session?.user ? (
              <AuthButtonClient
                buttonVariant={{
                  logout: {
                    variant: "link",
                  },
                }}
              />
            ) : (
              <Link
                href="/auth/login"
                className="px-3 py-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:no-underline"
              >
                Sign in
              </Link>
            )}

            <Link
              href={session?.user ? "/home" : "/auth/sign-up"}
              className="no-underline hover:no-underline"
            >
              <ShimmerButton
                background="hsl(var(--primary))"
                shimmerColor="#ffffff"
                className="flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-primary-foreground"
              >
                {session?.user ? "Go to app" : "Start a mission"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </ShimmerButton>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-muted md:hidden"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
    </nav>

    {/* Mobile menu */}
    {mobileOpen && (
      <div className="mt-2 overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-xl backdrop-blur-xl md:hidden">
        <div className="p-2">
          {/* Navigation links */}
          <div className="space-y-1">
            <Link
              href="#story"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-sm text-foreground no-underline transition-colors hover:bg-muted hover:no-underline"
            >
              The idea
            </Link>

            <Link
              href="#budget"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-sm text-foreground no-underline transition-colors hover:bg-muted hover:no-underline"
            >
              Budget
            </Link>

            <Link
              href="#on-the-go"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-sm text-foreground no-underline transition-colors hover:bg-muted hover:no-underline"
            >
              On The Go
            </Link>
          </div>

          {/* Theme */}
          <div className="my-2 border-t border-border/60" />

          <div className="flex min-h-12 items-center justify-between rounded-xl px-3">
            {/* <span className="text-sm text-muted-foreground">
              Theme
            </span> */}

            <div className="flex shrink-0 items-center justify-center">
              <ThemeSwitcher isText={true} />
            </div>
          </div>

          {/* Auth actions */}
          {!sessionLoading && (
            <>
              <div className="my-2 border-t border-border/60" />

              {session?.user ? (
                <div className="space-y-2 p-1">
                  {/* Logout */}
                  <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:rounded-xl">
                    <LogoutButton
                    className="w-full"
                    variant={"outline"}
                    />
                  </div>
                  {/* Go to app */}
                  <Link
                    href="/home"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full no-underline hover:no-underline"
                  >
                    <ShimmerButton
                      background="hsl(var(--primary))"
                      shimmerColor="#ffffff"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground"
                    >
                      Go to app
                      <ArrowUpRight className="h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 p-1">
                  {/* Sign in */}
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full rounded-xl"
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Link>
                  </Button>

                  {/* Start mission */}
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full no-underline hover:no-underline"
                  >
                    <ShimmerButton
                      background="hsl(var(--primary))"
                      shimmerColor="#ffffff"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground"
                    >
                      Start a mission
                      <ArrowUpRight className="h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )}
  </div>
</header>

      {/* HERO */}
      <section className="relative min-h-[850px] overflow-hidden px-4 pb-24 pt-36 sm:px-6 sm:pb-36 sm:pt-44">
        {/* CLOUD SKY — day palette in light mode, night sky in dark mode */}
        <div className="pointer-events-none absolute inset-0">
          {isDark ? (
            <CloudShader
              speed={isMobile ? 0.1 : 0.45}
              count={isMobile ? 2 : 5}
              cloudColor="#1b2233"
              skyTopColor="#05070d"
              skyBottomColor="#141c2e"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <CloudShader
              speed={isMobile ? 0.1 : 0.45}
              count={isMobile ? 2 : 5}
              cloudColor="#fbf8f2"
              skyTopColor="#5d91c4"
              skyBottomColor="#c7e0f2"
              className="absolute inset-0 h-full w-full"
            />
          )}

          {/* Stars, night mode only */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 dark:opacity-100"
            style={{
              backgroundImage:
                "radial-gradient(1.5px 1.5px at 20% 15%, rgba(255,255,255,0.9) 50%, transparent 50%)," +
                "radial-gradient(1px 1px at 65% 8%, rgba(255,255,255,0.7) 50%, transparent 50%)," +
                "radial-gradient(1.5px 1.5px at 80% 22%, rgba(255,255,255,0.8) 50%, transparent 50%)," +
                "radial-gradient(1px 1px at 40% 30%, rgba(255,255,255,0.6) 50%, transparent 50%)," +
                "radial-gradient(1px 1px at 90% 12%, rgba(255,255,255,0.6) 50%, transparent 50%)," +
                "radial-gradient(1.5px 1.5px at 10% 35%, rgba(255,255,255,0.5) 50%, transparent 50%)," +
                "radial-gradient(1px 1px at 55% 20%, rgba(255,255,255,0.5) 50%, transparent 50%)",
              backgroundRepeat: "repeat",
              backgroundSize: "300px 300px",
            }}
          />

          {/* Soft veil — brightens in light mode, deepens in dark mode */}
          <div className="absolute inset-0 bg-white/[0.08] dark:bg-black/[0.15]" />

          {/* Fade into the rest of the page */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/70 to-transparent" />

          {/* Slight side fade */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/20 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/20 to-transparent" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <BlurFade delay={0.05} inView>
                <div className="mb-7 flex items-center gap-3">
                  <ArrowMark className="gap-0" />

                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Plan · Execute · Complete
                  </span>
                </div>
              </BlurFade>

              <BlurFade delay={0.1} inView>
                <h1 className="max-w-3xl font-heading text-6xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[86px]">
                  Make the thing
                  <br />
                  you keep
                  <br />
                  <span className="text-primary">
                    putting off.
                  </span>
                </h1>
              </BlurFade>

              <BlurFade delay={0.2} inView>
                <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Turn it into a mission with a budget, concrete
                  steps, and one thing to do next.
                </p>
              </BlurFade>

              <BlurFade delay={0.3} inView>
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="blockF no-underline hover:no-underline"
                  >
                    <ShimmerButton
                      background="hsl(var(--primary))"
                      shimmerColor="#ffffff"
                      className="flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground"
                    >
                      Start a mission
                      <ArrowUpRight className="h-4 w-4" />
                    </ShimmerButton>
                  </Link>

                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 px-4 hover:bg-trasnparent"
                  >
                    <Link href="#story">
                      See how it works
                      <MoveDownRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </BlurFade>

              <BlurFade delay={0.4} inView>
                <div className="mt-9 flex items-center gap-3 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  Free to start. No card required.
                </div>
              </BlurFade>
            </div>

            <BlurFade delay={0.25} inView>
  <div className="relative">
    <div className="absolute -inset-6 rounded-[3rem] bg-primary/[0.045] blur-3xl" />

    <div className="relative rotate-[1.2deg] overflow-hidden rounded-[1.5rem] border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] transition-transform duration-700 hover:rotate-0">
      <Image
        alt="Mission page"
        src={!isDark ? "/screenshot-mission-id.png" : "/screenshot-mission-id-darkmode.png"}
        width={600}
        height={760}
        priority
        className="h-auto w-full object-cover"
      />
    </div>

    {/* keep these two if you still want the floating badges */}
    <div className="absolute -bottom-5 -left-5 hidden rotate-[-4deg] rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
      {/* ... "8 tasks" chip ... */}
    </div>
    <div className="absolute -right-4 top-12 hidden rotate-[4deg] rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
      {/* ... "$180" chip ... */}
    </div>
  </div>
</BlurFade>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section
        id="story"
        className="scroll-mt-24 border-y bg-[#f4f2ed] px-4 py-28 dark:bg-muted/20 sm:px-6 sm:py-40"
      >
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow>The idea</SectionEyebrow>

          <BlurFade inView>
            <h2 className="font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-8xl">
              A goal says "get fit."
              <br />
              <span className="text-primary">
                A mission says what that costs.
              </span>
            </h2>
          </BlurFade>

          <BlurFade delay={0.15} inView>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Missiono turns what you want to do into a sequence of
              steps — each one with a price on it. Not a to-do list.
              A plan you can actually afford to finish.
            </p>
          </BlurFade>

          <BlurFade delay={0.25} inView>
            <ArrowMark className="mt-12 justify-center" />
          </BlurFade>
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="px-4 py-28 sm:px-6 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <SectionEyebrow>How it works</SectionEyebrow>

              <h2 className="max-w-md font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                Every step gets a name, a price, and a place in line.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
                Add a task, say what it'll cost, and mark it done when
                it's done. That's the whole interface.
              </p>
            </div>

            <TaskFlow />
          </div>
        </div>
      </section>

      {/* MISSION SHOWCASE */}
      <section className="px-4 pb-28 sm:px-6 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border bg-muted/25 p-5 sm:p-8 lg:p-12">
            <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <SectionEyebrow>
                  The whole mission, in one place
                </SectionEyebrow>

                <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                  No notes app for the plan. No spreadsheet for the money.
                </h2>

                <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
                  The objective, the budget, the tasks, and what's
                  left to do — on one page, not spread across three
                  apps.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    "Tasks grouped by what's actually done",
                    "Switch between missions without losing your place",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </div>

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <MissionCard />
            </div>
          </div>
        </div>
      </section>

      {/* BUDGET */}
      <section
        id="budget"
        className="scroll-mt-24 border-y bg-[#f4f2ed] px-4 py-28 dark:bg-muted/20 sm:px-6 sm:py-36 bg-background relative flex size-full items-center justify-center overflow-hidden rounded-lg border p-20"
      >

        <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      />
        
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <SectionEyebrow>
                Money matters
              </SectionEyebrow>

              <h2 className="max-w-2xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-foreground sm:text-7xl">
                Every mission has a budget.
                <br />
                <span className="text-primary">
                  Every step has a price.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">
                "Set up analytics" costs $24. "Launch publicly" costs
                $120. Price each step before you take it, and you'll
                always know how much of your mission is left to fund
                — not just how much is left to do.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <CircleDollarSign className="h-5 w-5 text-primary" />

                  <h3 className="mt-5 text-sm font-semibold text-foreground">
                    Expected vs actual
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    Estimate the cost before you commit. Record the
                    real number after. Watch the gap close as your
                    plan gets sharper.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-background p-5">
                  <Wallet className="h-5 w-5 text-primary" />

                  <h3 className="mt-5 text-sm font-semibold text-foreground">
                    Live spending
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    No end-of-month surprise. See what's spent and
                    what's still available, in real time, next to the
                    step it paid for.
                  </p>
                </div>
              </div>
            </div>

            <BudgetCard />
          </div>
        </div>
      </section>

      {/* ON THE GO */}
      <section
        id="on-the-go"
        className="scroll-mt-24 overflow-hidden bg-[#0c1017] px-4 py-28 text-white sm:px-6 sm:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                <span className="h-px w-7 bg-blue-300" />
                On The Go
              </div>

              <h2 className="max-w-2xl font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-7xl">
                Planning is not the hard part.
                <br />
                <span className="text-blue-300">
                  Doing it on a Tuesday is.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/50">
                When it's time to actually work, Missiono strips away
                everything but what's in front of you: the current
                step, what it costs, and what's next after.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Current step",
                  "What it costs",
                  "Progress",
                  "Up next",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* <Link
                href="/on-the-go"
                className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 no-underline hover:text-blue-200 hover:no-underline"
              >
                Open On The Go
                <ArrowRight className="h-4 w-4" />
              </Link> */}
            </div>

            <BlurFade inView>
              <OnTheGo />
            </BlurFade>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 py-28 sm:px-6 sm:py-40 bg-background relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-neutral-100/80 dark:bg-neutral-950">
      {/* <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      /> */}
          <NoiseTexture
        className={cn(
          "absolute inset-0",
          "mask-[radial-gradient(420px_circle_at_center,white,transparent)]"
        )}
      />
        
        <div className="mx-auto max-w-6xl ">

          
          <div className="max-w-2xl">
            <SectionEyebrow>
              Everything a mission needs
            </SectionEyebrow>

            <h2 className="font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              What's inside
              <br />
              <span className="text-primary">
                every mission.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MagicCard
              className="min-h-[300px] rounded-[1.5rem] border bg-card lg:col-span-2"
              gradientColor="#3b82f6"
              gradientOpacity={0.08}
            >
              <div className="flex h-full flex-col justify-between p-7 sm:p-9">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Compass className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-heading text-3xl font-semibold tracking-tight text-card-foreground">
                    Missions
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    Give it a name, a description, and a budget before
                    you take the first step.
                  </p>
                </div>
              </div>
            </MagicCard>

            <MagicCard
              className="min-h-[300px] rounded-[1.5rem] border bg-card"
              gradientColor="#3b82f6"
              gradientOpacity={0.08}
            >
              <div className="flex h-full flex-col justify-between p-7">
                <ListChecks className="h-5 w-5 text-primary" />

                <div>
                  <h3 className="font-heading text-2xl font-semibold text-card-foreground">
                    Tasks
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Every mission breaks down into steps you can
                    actually finish today. No step is too small to
                    count.
                  </p>
                </div>
              </div>
            </MagicCard>

            <MagicCard
              className="min-h-[300px] rounded-[1.5rem] border bg-card"
              gradientColor="#3b82f6"
              gradientOpacity={0.08}
            >
              <div className="flex h-full flex-col justify-between p-7">
                <Wallet className="h-5 w-5 text-primary" />

                <div>
                  <h3 className="font-heading text-2xl font-semibold text-card-foreground">
                    Budget
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Expected, spent, and remaining — attached to the
                    step it belongs to, not buried in a separate app.
                  </p>
                </div>
              </div>
            </MagicCard>

            <MagicCard
              className="min-h-[300px] rounded-[1.5rem] border bg-card lg:col-span-2"
              gradientColor="#3b82f6"
              gradientOpacity={0.08}
            >
              <div className="flex h-full flex-col justify-between p-7 sm:p-9">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-heading text-3xl font-semibold tracking-tight text-card-foreground">
                    Focus mode
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    Stop managing the mission and start running it. On
                    The Go gives you only the current step, its cost,
                    and what's next.
                  </p>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* MISSION FLOW */}
      <section className="border-y bg-muted/20 px-4 py-28 sm:px-6 sm:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow>
            From idea to done
          </SectionEyebrow>

          <h2 className=" flex flex-col items-center justify-center align-center md:flex-row gap-2 font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
            <span>
              Plan.
            <span className="mx-2 text-primary">↗</span>
            </span>
            <span>
            Execute.
            <span className="mx-2 text-primary">↗</span>
            </span>
            <span>
            Complete.
            <span className="mx-2 text-primary">↗</span>
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-muted-foreground">
            Not your whole life — just the handful of things that
            actually matter to you right now.
          </p>

          {/* <div className="mx-auto mt-16 max-w-3xl">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Plan",
                  desc: "Name it, budget it, break it down",
                  icon: Compass,
                },
                {
                  number: "02",
                  title: "Execute",
                  desc: "One step at a time, cost included",
                  icon: Play,
                },
                {
                  number: "03",
                  title: "Complete",
                  desc: "Actually finished, not just archived.",
                  icon: CheckCircle2,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <BlurFade
                    key={item.number}
                    delay={index * 0.12}
                    inView
                  >
                    <div className="relative rounded-2xl border border-border bg-background p-6 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.number}
                        </span>
                      </div>

                      <div className="mt-10 font-heading text-2xl font-semibold text-foreground">
                        {item.title}
                      </div>

                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </BlurFade>
                );
              })}
            </div>
          </div> */}

          <ArrowMark className="mt-14 justify-center" />
        </div>
      </section>

      {/* CTA */}
    <section className="relative overflow-hidden px-4 py-32 sm:px-6 sm:py-48">
  <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-3xl" />

  <div className="relative mx-auto max-w-4xl text-center">
    <BlurFade inView>
      {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
        <Target className="h-5 w-5 text-primary" />
      </div> */}

      {session?.user ? (
        <>
          <h2 className="mt-8 font-heading text-6xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-8xl">
            Ready to get
            <br />
            <span className="text-primary">back to it?</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Your missions are waiting. Keep moving forward,
            one step at a time.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/home"
              className="block no-underline hover:no-underline"
            >
              <ShimmerButton
                background="hsl(var(--primary))"
                shimmerColor="#ffffff"
                className="flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-primary-foreground"
              >
                Go to your missions
                <ArrowUpRight className="h-4 w-4" />
              </ShimmerButton>
            </Link>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-8 font-heading text-6xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-8xl">
            So — what's
            <br />
            <span className="text-primary">the mission?</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            The side project. The certification. The trip you've
            been pricing out for a year. Give it a name, a budget,
            and a next step — and find out what happens when
            "someday" has a plan behind it.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/sign-up"
              className="block no-underline hover:no-underline"
            >
              <ShimmerButton
                background="hsl(var(--primary))"
                shimmerColor="#ffffff"
                className="flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-primary-foreground"
              >
                Start a mission
                <ArrowUpRight className="h-4 w-4" />
              </ShimmerButton>
            </Link>

            <Button
              asChild
              variant="ghost"
              className="h-12"
            >
              <Link href="/auth/login">
                I already have an account
              </Link>
            </Button>
          </div>
        </>
      )}

      <ArrowMark className="mt-12 justify-center" />
    </BlurFade>
  </div>
</section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Logo />

          <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
            <Link
              href="#story"
              className="no-underline hover:no-underline"
            >
              The idea
            </Link>

            <Link
              href="#budget"
              className="no-underline hover:no-underline"
            >
              Budget
            </Link>

            <Link
              href="#on-the-go"
              className="no-underline hover:no-underline"
            >
              On The Go
            </Link>

            <span>
              © {new Date().getFullYear()} Missiono
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}