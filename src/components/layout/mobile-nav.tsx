// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/cases", label: "Cases" },
    { href: "/progress", label: "Progress" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden p-2"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <nav className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}