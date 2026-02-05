"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search, Moon, Sun, Menu } from "lucide-react";
import MobileDrawer from "./MobileDrawer";

export default function TopBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? (resolvedTheme ?? theme) : "light";
  const next = current === "dark" ? "light" : "dark";

  return (
    <header className="sticky top-0 z-[150] bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        {/* DESKTOP: Original 3-column grid (≥768px) */}
        <div className="hidden md:grid grid-cols-3 items-center gap-4 h-16">
          {/* Desktop Column 1: Brand */}
          <Link
            href="/"
            className="justify-self-start font-semibold tracking-wide cursor-pointer text-text-primary hover:opacity-75 transition-opacity outline-none"
          >
            Camera setup
          </Link>

          {/* Desktop Column 2: Nav */}
          <nav className="justify-self-center">
            <ul className="flex items-center gap-6 text-sm text-text-primary">
              <li><Link href="/product" className="hover:text-accent transition-colors">Product</Link></li>
              <li><Link href="/activity-setup" className="hover:text-accent transition-colors">Activity setup</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About us</Link></li>
            </ul>
          </nav>

          {/* Desktop Column 3: Search + Theme */}
          <div className="justify-self-end flex items-center gap-3">
            <form
              role="search"
              className="relative"
              onSubmit={(e) => { e.preventDefault(); }}
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                size={20}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search…"
                className="h-9 w-56 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-secondary pl-10 pr-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                style={{ background: 'var(--surface)' }}
              />
            </form>

            <button
              type="button"
              aria-label="Toggle theme"
              className="h-11 w-11 rounded-full border border-border bg-surface text-text-primary flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent outline-none transition-all"
              onClick={() => setTheme(next)}
            >
              {current === "dark" ? (
                <Sun size={20} aria-hidden="true" />
              ) : (
                <Moon size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE: 2-column layout (<768px) */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Mobile Left: Brand */}
          <Link
            href="/"
            className="font-semibold tracking-wide text-text-primary hover:opacity-75 transition-opacity outline-none"
          >
            Camera setup
          </Link>

          {/* Mobile Right: Theme + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              aria-label="Toggle theme"
              className="h-11 w-11 rounded-full border border-border bg-surface text-text-primary flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent outline-none transition-all"
              onClick={() => setTheme(next)}
            >
              {current === "dark" ? (
                <Sun size={20} aria-hidden="true" />
              ) : (
                <Moon size={20} aria-hidden="true" />
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              type="button"
              aria-label="Open menu"
              className="h-11 w-11 rounded-full border border-border bg-surface text-text-primary flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent outline-none transition-all"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {/* Navigation Links */}
        <nav className="mb-6">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            Navigation
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/product"
                className="block px-4 py-3 rounded-lg text-text-primary hover:bg-accent hover:text-white transition-all min-h-[44px] flex items-center"
                onClick={() => setIsDrawerOpen(false)}
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                href="/activity-setup"
                className="block px-4 py-3 rounded-lg text-text-primary hover:bg-accent hover:text-white transition-all min-h-[44px] flex items-center"
                onClick={() => setIsDrawerOpen(false)}
              >
                Activity setup
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block px-4 py-3 rounded-lg text-text-primary hover:bg-accent hover:text-white transition-all min-h-[44px] flex items-center"
                onClick={() => setIsDrawerOpen(false)}
              >
                About us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search */}
        <div>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            Search
          </h3>
          <form
            role="search"
            className="relative"
            onSubmit={(e) => { e.preventDefault(); }}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={20}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search…"
              className="h-11 w-full rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary pl-10 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent transition-all"
              style={{ background: 'var(--surface)' }}
            />
          </form>
        </div>
      </MobileDrawer>
    </header>
  );
}
