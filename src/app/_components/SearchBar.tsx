import React, { useState, useEffect } from "react";
import { Search, Filter, MenuIcon } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersToggle: () => void;
  appliedFiltersCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFiltersToggle,
  appliedFiltersCount,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  return (
    <div className="sticky top-0 z-30 border-b border-gray-200 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-2xl">
                🧠
              </div>
              <h1 className="text-xl font-bold text-white">
                MindCare Pakistan
              </h1>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, shown on desktop */}
          <div className="mx-8 hidden max-w-2xl flex-1 md:flex">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search by name, expertise, education, or specializations..."
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-teal-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile Search & Filter Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onFiltersToggle}
              className="hover:bg-gray relative rounded-md p-2 text-2xl text-white  hover:text-gray-200"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search therapists..."
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-teal-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
