"use client";

import Link from "next/link";
import { useCompareTray } from "./CompareTrayProvider";

export function CompareTray() {
  const { items, remove, clear } = useCompareTray();

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5">
      <div
        className="
          mx-auto
          max-w-6xl
          overflow-hidden
          rounded-2xl
          border
          border-[#d9dfd4]
          bg-white/95
          shadow-[0_-10px_40px_rgba(23,58,42,0.12)]
          backdrop-blur-xl
        "
      >
        {/* Top accent */}
        <div className="h-1 bg-[#24543b]" />

        <div className="px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Compare heading */}
            <div className="flex shrink-0 items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#edf3e8]
                  text-[#24543b]
                "
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 4v16" />
                  <path d="M16 4v16" />
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#173a2a]">
                  Compare colleges
                </p>

                <p className="text-xs text-slate">
                  {items.length} selected
                  {items.length < 2 && " · Add one more"}
                </p>
              </div>
            </div>

            {/* Selected colleges */}
            <div className="min-w-0 flex-1">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="
                      group
                      inline-flex
                      min-w-0
                      max-w-[230px]
                      shrink-0
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#e0ddd4]
                      bg-[#f8f7f2]
                      px-3
                      py-2
                      transition
                      hover:border-[#b9cbbd]
                      hover:bg-[#edf3e8]
                    "
                  >
                    {/* College indicator */}
                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#24543b]
                        text-xs
                        font-semibold
                        text-white
                      "
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </span>

                    <span
                      className="
                        min-w-0
                        truncate
                        text-xs
                        font-medium
                        text-[#31533c]
                      "
                      title={item.name}
                    >
                      {item.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      aria-label={`Remove ${item.name} from comparison`}
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-slate
                        transition
                        hover:bg-white
                        hover:text-red-600
                      "
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-2
                border-t
                border-[#ece9e1]
                pt-3
                sm:justify-end
                lg:border-t-0
                lg:pt-0
              "
            >
              <button
                type="button"
                onClick={clear}
                className="
                  rounded-full
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-slate
                  transition
                  hover:bg-[#f3f1eb]
                  hover:text-[#173a2a]
                "
              >
                Clear all
              </button>

              <Link
                href="/compare"
                aria-disabled={items.length < 2}
                className={`
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  transition
                  ${
                    items.length >= 2
                      ? "bg-[#24543b] text-white shadow-sm hover:bg-[#183f2c]"
                      : "cursor-not-allowed bg-[#e7e5de] text-slate pointer-events-none"
                  }
                `}
              >
                Compare
                {items.length >= 2 && (
                  <span
                    className="
                      rounded-full
                      bg-white/15
                      px-1.5
                      py-0.5
                      text-xs
                    "
                  >
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}