import Link from "next/link";

export default function Logo({href="/"}: {href?: string}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-foreground no-underline hover:no-underline"
    >
      <svg
        width="24"
        height="20"
        viewBox="0 0 32 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M2 26L16 14L30 26"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary opacity-45 transition-transform duration-300 ease-out group-hover:-translate-y-[1.5px]"
        />
        <path
          d="M2 19L16 7L30 19"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary opacity-70 transition-transform duration-300 ease-out delay-75 group-hover:-translate-y-[1.5px]"
        />
        <path
          d="M2 12L16 0L30 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary transition-transform duration-300 ease-out delay-150 group-hover:-translate-y-[1.5px]"
        />
      </svg>

      <span className="font-body text-lg font-bold tracking-[-0.04em]">
        Missiono
      </span>
    </Link>
  );
}