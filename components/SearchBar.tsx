"use client";

import { useEffect, useState } from "react";

export function SearchBar({
  initialValue,
  onSearch,
  placeholder = "Search by college name or city…",
}: {
  initialValue: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initialValue);

  // Debounce search so the API is not called on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      if (value !== initialValue) {
        onSearch(value);
      }
    }, 350);

    return () => clearTimeout(t);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative">
      {/* Search icon */}
      <div
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          z-10
          flex
          -translate-y-1/2
          items-center
          justify-center
          text-[#66806c]
        "
        aria-hidden="true"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-[#d9dfd4]
          bg-white
          py-3.5
          pl-12
          pr-4
          text-sm
          font-medium
          text-[#173a2a]
          outline-none
          shadow-sm
          placeholder:text-[#8c978f]
          transition
          hover:border-[#b9cbbd]
          focus:border-[#24543b]
          focus:ring-2
          focus:ring-[#24543b]/10
        "
        aria-label="Search colleges"
      />
    </div>
  );
}