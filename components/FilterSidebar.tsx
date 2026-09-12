"use client";

import type { ReactNode } from "react";

export type Facets = {
  districts: string[];
  states: string[];
  types: string[];
  streams: string[];
  feesMin: number;
  feesMax: number;
};

export type FilterState = {
  district: string;
  stream: string;
  type: string;
  minRating: string;
  maxFees: string;
};

type FilterSidebarProps = {
  facets: Facets;
  filters: FilterState;
  onChange: (
    next: Partial<FilterState>
  ) => void;
  onReset: () => void;
};

export function FilterSidebar({
  facets,
  filters,
  onChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside
      className="
        sticky
        top-5
        rounded-2xl
        border
        border-[#183f2c]
        bg-[#24543b]
        p-6
        shadow-[0_12px_35px_rgba(23,58,42,0.22)]
      "
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="mb-7">

        <div
          className="
            mb-3
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              text-[#24543b]
              shadow-sm
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
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
            </svg>
          </div>

          <div>

            <h2
              className="
                font-display
                text-xl
                font-semibold
                text-white
              "
            >
              Filters
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-white/65
              "
            >
              Narrow your college search
            </p>

          </div>

        </div>

        <div
          className="
            h-px
            bg-white/15
          "
        />

      </div>

      {/* =================================================
          FILTERS
          ================================================= */}

      <div className="space-y-5">

        {/* District */}

        <FilterField
          label="District"
          description="Choose your preferred district"
        >
          <Select
            value={filters.district}
            onChange={(value) =>
              onChange({
                district: value,
              })
            }
          >

            <option value="">
              All districts
            </option>

            {facets.districts.map(
              (district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              )
            )}

          </Select>
        </FilterField>

        {/* Stream */}

        <FilterField
          label="Stream"
          description="Select your area of study"
        >
          <Select
            value={filters.stream}
            onChange={(value) =>
              onChange({
                stream: value,
              })
            }
          >

            <option value="">
              All streams
            </option>

            {facets.streams.map(
              (stream) => (
                <option
                  key={stream}
                  value={stream}
                >
                  {stream}
                </option>
              )
            )}

          </Select>
        </FilterField>

        {/* College Type */}

        <FilterField
          label="College Type"
          description="Choose the institution type"
        >
          <Select
            value={filters.type}
            onChange={(value) =>
              onChange({
                type: value,
              })
            }
          >

            <option value="">
              All types
            </option>

            {facets.types.map(
              (type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              )
            )}

          </Select>
        </FilterField>

        {/* Minimum Rating */}

        <FilterField
          label="Minimum Rating"
          description="Show colleges above this rating"
        >
          <Select
            value={filters.minRating}
            onChange={(value) =>
              onChange({
                minRating: value,
              })
            }
          >

            <option value="">
              Any rating
            </option>

            <option value="4.5">
              4.5+ ⭐
            </option>

            <option value="4">
              4.0+ ⭐
            </option>

            <option value="3.5">
              3.5+ ⭐
            </option>

            <option value="3">
              3.0+ ⭐
            </option>

          </Select>
        </FilterField>

        {/* Maximum Fees */}

        <FilterField
          label="Maximum Annual Fees"
          description="Set your maximum budget"
        >
          <Select
            value={filters.maxFees}
            onChange={(value) =>
              onChange({
                maxFees: value,
              })
            }
          >

            <option value="">
              Any fee
            </option>

            <option value="50000">
              ₹50,000
            </option>

            <option value="100000">
              ₹1,00,000
            </option>

            <option value="150000">
              ₹1,50,000
            </option>

            <option value="200000">
              ₹2,00,000
            </option>

            <option value="300000">
              ₹3,00,000
            </option>

            <option value="500000">
              ₹5,00,000
            </option>

          </Select>
        </FilterField>

      </div>

      {/* =================================================
          RESET BUTTON
          ================================================= */}

      <button
        type="button"
        onClick={onReset}
        className="
          mt-7
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-white/20
          bg-white
          px-4
          py-3
          text-sm
          font-semibold
          text-[#24543b]
          shadow-sm
          transition
          hover:bg-[#f3f7f1]
          active:scale-[0.99]
        "
      >

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v6h6" />
        </svg>

        Reset filters

      </button>

    </aside>
  );
}

/* =========================================================
   FILTER FIELD
   ========================================================= */

function FilterField({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block">

        <span
          className="
            block
            text-sm
            font-semibold
            text-white
          "
        >
          {label}
        </span>

        <span
          className="
            mt-0.5
            block
            text-[11px]
            leading-4
            text-white/60
          "
        >
          {description}
        </span>

      </label>

      {children}

    </div>
  );
}

/* =========================================================
   SELECT
   ========================================================= */

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          appearance-none
          rounded-xl
          border
          border-white/15
          bg-white
          px-4
          py-3
          pr-10
          text-sm
          font-medium
          text-[#173a2a]
          shadow-sm
          outline-none
          transition
          hover:border-white/40
          focus:border-white
          focus:ring-2
          focus:ring-white/20
        "
      >
        {children}
      </select>

      {/* Dropdown icon */}

      <div
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          flex
          -translate-y-1/2
          items-center
          justify-center
          text-[#24543b]
        "
      >

        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>

      </div>

    </div>
  );
}