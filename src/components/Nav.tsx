"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/map", label: "圣地地图" },
  { href: "/generate", label: "生成同款" },
  { href: "/plaza", label: "同款广场" },
  { href: "/route", label: "路线规划" },
  { href: "/behind-ai", label: "AI 揭秘" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-canvas border-b border-hairline-soft">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-ink">
              <span className="text-xl">★</span>
              <span>K·Star·Spot</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    pathname === l.href
                      ? "bg-ink text-white"
                      : "text-steel hover:text-ink hover:bg-surface"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/generate"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors"
              >
                ✨ 生成同款
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={cn("block w-6 h-0.5 bg-ink transition-transform", open && "rotate-45 translate-y-2")} />
              <span className={cn("block w-6 h-0.5 bg-ink transition-opacity", open && "opacity-0")} />
              <span className={cn("block w-6 h-0.5 bg-ink transition-transform", open && "-rotate-45 -translate-y-2")} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 bg-canvas pt-16 flex flex-col" onClick={() => setOpen(false)}>
          <div className="section-container py-6 flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-5 py-4 rounded-2xl text-base font-medium transition-colors",
                  pathname === l.href
                    ? "bg-ink text-white"
                    : "text-ink hover:bg-surface"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-hairline-soft mt-2">
              <Link
                href="/generate"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-4 rounded-full bg-ink text-white text-base font-medium"
              >
                ✨ 生成我的同款照
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
