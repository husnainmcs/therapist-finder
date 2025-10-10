'use client'
import { useState } from "react";
import { type NextPage } from "next";
import { Filter, Loader } from "lucide-react";
import { SearchBar } from "@/app/_components/SearchBar";
import { FilterSidebar } from "@/app/_components/FilterSidebar";
import { TherapistCard } from "@/app/_components/TherapistCard";
import { TherapistModal } from "@/app/_components/TherapistModal";
import type { FilterType } from "@/app/_components/FilterSidebar";
import { api } from "@/trpc/react";

type Filters = {
  cities: string[];
  genders: string[];
  experienceRanges: string[];
  feeRanges: string[];
  modes: string[];
};

const Home: NextPage = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    cities: [],
    genders: [],
    experienceRanges: [],
    feeRanges: [],
    modes: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(
    null,
  );
  const [cursor, setCursor] = useState<string | undefined>();

  // Fetch filter options
  const { data: filterOptions } = api.therapists.getFilterOptions.useQuery();

  // Fetch therapists with filters
  const {
    data: therapistData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = api.therapists.getAll.useInfiniteQuery(
    {
      search: searchQuery,
      cities: filters.cities,
      genders: filters.genders,
      experienceRanges: filters.experienceRanges,
      feeRanges: filters.feeRanges,
      modes: filters.modes,
      limit: 12,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  // Calculate applied filters count
  const appliedFiltersCount = Object.values(filters).reduce(
    (count, filterArray) => count + filterArray.length,
    0,
  );

  // Handle filter changes
  const handleFilterChange = (filterType: FilterType, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[filterType];
      const isCurrentlySelected = currentArray.includes(value);

      if (filterType === "experienceRanges" || filterType === "feeRanges") {
        // Single selection for these filter types
        return {
          ...prev,
          [filterType]: isCurrentlySelected ? [] : [value],
        };
      } else {
        // Multiple selection for other filter types
        return {
          ...prev,
          [filterType]: isCurrentlySelected
            ? currentArray.filter((item) => item !== value)
            : [...currentArray, value],
        };
      }
    });
    setCursor(undefined); // Reset pagination when filters change
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({
      cities: [],
      genders: [],
      experienceRanges: [],
      feeRanges: [],
      modes: [],
    });
    setCursor(undefined);
  };

  // Load more therapists
  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  // Flatten all therapists from pages
  const allTherapists =
    therapistData?.pages.flatMap((page) => page.therapists) || [];

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
      {/* Search Header */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersToggle={() => setIsFilterOpen(!isFilterOpen)}
        appliedFiltersCount={appliedFiltersCount}
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex">
          {/* Filter Sidebar */}
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={
                filterOptions || { cities: [], genders: [], modes: [] }
              }
              onClearAll={handleClearAll}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <div className="lg:hidden">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={
                filterOptions || { cities: [], genders: [], modes: [] }
              }
              onClearAll={handleClearAll}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="p-6">
              {/* Results Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {isLoading
                      ? "Loading therapists..."
                      : `${allTherapists.length} therapists found`}
                  </h2>
                  {(searchQuery || appliedFiltersCount > 0) && (
                    <p className="mt-1 text-sm text-gray-600">
                      {searchQuery && `Search: "${searchQuery}"`}
                      {searchQuery && appliedFiltersCount > 0 && " • "}
                      {appliedFiltersCount > 0 &&
                        `${appliedFiltersCount} filter${appliedFiltersCount > 1 ? "s" : ""} applied`}
                    </p>
                  )}
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {appliedFiltersCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs text-white">
                      {appliedFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-teal-500" />
                </div>
              )}

              {/* Results Grid */}
              {!isLoading && (
                <>
                  {allTherapists.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mb-4 text-gray-400">
                        <Filter className="mx-auto h-12 w-12" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        No therapists found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your search criteria or filters to see
                        more results.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Therapists Grid */}
                      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {allTherapists.map((therapist) => (
                          <TherapistCard
                            key={therapist.id}
                            therapist={therapist}
                            onClick={() => setSelectedTherapist(therapist.id)}
                          />
                        ))}
                      </div>

                      {/* Load More Button */}
                      {hasNextPage && (
                        <div className="flex justify-center">
                          <button
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            className="rounded-md bg-teal-500 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:bg-teal-300"
                          >
                            {isFetching ? (
                              <div className="flex items-center space-x-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              "Load More Therapists"
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {!isFilterOpen && (
        <div className="fixed right-6 bottom-6 z-40 lg:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="transform rounded-full bg-teal-500 p-4 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-teal-600"
          >
            <Filter className="h-6 w-6" />
            {appliedFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {appliedFiltersCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Therapist Detail Modal */}
      {selectedTherapist && (
        <TherapistModal
          therapistId={selectedTherapist}
          onClose={() => setSelectedTherapist(null)}
        />
      )}
    </div>
  );
};

export default Home;
