import React from "react";
import { X } from "lucide-react";

interface FilterOption {
  name: string;
  count: number;
}

// Define the filter types explicitly
export type FilterType =
  | "cities"
  | "genders"
  | "experienceRanges"
  | "feeRanges"
  | "modes";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    cities: string[];
    genders: string[];
    experienceRanges: string[];
    feeRanges: string[];
    modes: string[];
  };
  onFilterChange: (filterType: FilterType, value: string) => void; // Fixed type
  filterOptions: {
    cities: FilterOption[];
    genders: FilterOption[];
    modes: string[];
  };
  onClearAll: () => void;
}

const experienceRanges = [
  { value: "0-5", label: "0-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10-15", label: "10-15 years" },
  { value: "15+", label: "15+ years" },
];

const feeRanges = [
  { value: "<2000", label: "Under Rs. 2,000" },
  { value: "2000-4000", label: "Rs. 2,000 - 4,000" },
  { value: "4000-6000", label: "Rs. 4,000 - 6,000" },
  { value: ">6000", label: "Above Rs. 6,000" },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  filterOptions,
  onClearAll,
}) => {
  const mainCities = ["Karachi", "Lahore", "Islamabad"];
  const otherCitiesCount = filterOptions.cities
    .filter((city) => !mainCities.includes(city.name))
    .reduce((sum, city) => sum + city.count, 0);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-80 transform flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:transform-none dark:border-gray-700 dark:bg-gray-800 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onClearAll}
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Clear All
            </button>
            <button onClick={onClose} className="rounded p-1 lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {/* City Filter */}
          <div>
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
              City
            </h3>
            <div className="space-y-2">
              {mainCities.map((city) => {
                const cityData = filterOptions.cities.find(
                  (c) => c.name === city,
                );
                const count = cityData?.count || 0;
                return (
                  <label
                    key={city}
                    className="group flex cursor-pointer items-center justify-between"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.cities.includes(city)}
                        onChange={() => onFilterChange("cities", city)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                        {city}
                      </span>
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                      {count}
                    </span>
                  </label>
                );
              })}

              {otherCitiesCount > 0 && (
                <label className="group flex cursor-pointer items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.cities.includes("Other")}
                      onChange={() => onFilterChange("cities", "Other")}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                      Other
                    </span>
                  </div>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    {otherCitiesCount}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Experience Filter */}
          <div>
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
              Experience
            </h3>
            <div className="space-y-2">
              {experienceRanges.map((range) => (
                <label
                  key={range.value}
                  className="group flex cursor-pointer items-center"
                >
                  <input
                    type="checkbox"
                    name="experience"
                    checked={filters.experienceRanges.includes(range.value)}
                    onChange={() =>
                      onFilterChange("experienceRanges", range.value)
                    }
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
              Gender
            </h3>
            <div className="space-y-2">
              {filterOptions.genders.map((gender) => (
                <label
                  key={gender.name}
                  className="group flex cursor-pointer items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.genders.includes(gender.name)}
                      onChange={() => onFilterChange("genders", gender.name)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                      {gender.name.toLowerCase()}
                    </span>
                  </div>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    {gender.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fee Range Filter */}
          <div>
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
              Fee Range
            </h3>
            <div className="space-y-2">
              {feeRanges.map((range) => (
                <label
                  key={range.value}
                  className="group flex cursor-pointer items-center"
                >
                  <input
                    type="checkbox"
                    name="feeRange"
                    checked={filters.feeRanges.includes(range.value)}
                    onChange={() => onFilterChange("feeRanges", range.value)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Consultation Mode Filter */}
          <div>
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
              Consultation Mode
            </h3>
            <div className="space-y-2">
              {filterOptions.modes.map((mode) => (
                <label
                  key={mode}
                  className="group flex cursor-pointer items-center"
                >
                  <input
                    type="checkbox"
                    checked={filters.modes.includes(mode)}
                    onChange={() => onFilterChange("modes", mode)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                    {mode}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
