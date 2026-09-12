import Link from "next/link";

export function Nav() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#e6e1d5]
        bg-[#f7f5ef]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[72px]
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#24543b]
              shadow-sm
              transition
              group-hover:bg-[#183f2c]
            "
          >
            <span
              className="
                font-display
                text-lg
                font-semibold
                text-white
              "
            >
              V
            </span>
          </div>

          <div className="leading-none">
            <span
              className="
                font-display
                text-xl
                font-semibold
                tracking-tight
                text-[#173a2a]
              "
            >
              Vidya
            </span>

            <span
              className="
                ml-2
                hidden
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[#8b6b20]
                sm:inline
              "
            >
              College Discovery
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/colleges"
            className="
              rounded-full
              px-4
              py-2.5
              text-sm
              font-medium
              text-[#31533c]
              transition
              hover:bg-[#edf3e8]
              hover:text-[#173a2a]
            "
          >
            Browse colleges
          </Link>

          <Link
            href="/compare"
            className="
              rounded-full
              border
              border-[#d9dfd4]
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-[#24543b]
              shadow-sm
              transition
              hover:border-[#24543b]
              hover:bg-[#edf3e8]
            "
          >
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}