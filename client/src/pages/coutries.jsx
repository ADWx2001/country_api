import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Countries() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    region: "All",
    subregion: "All",
    capital: "All",
    language: "All",
    currency: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueFilters, setUniqueFilters] = useState({
    regions: [],
    subregions: [],
    capitals: [],
    languages: [],
    currencies: [],
  });
  const itemsPerPage = 12;

  const regions = [
    {
      name: "Asia",
      image:
        "https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFzaWF8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Europe",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGV1cm9wZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Africa",
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Americas",
      image:
        "https://plus.unsplash.com/premium_photo-1733266821825-b5a3724e081d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YW1lcmljYXN8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Oceania",
      image:
        "https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&w=800&q=80",
    },
  ];

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);

        //Extract unique filter values from the initial data
        const regions = [...new Set(data.map((c) => c.region))].filter(Boolean);
        const subregions = [...new Set(data.map((c) => c.subregion))].filter(
          Boolean
        );
        const capitals = [
          ...new Set(data.flatMap((c) => c.capital || [])),
        ].filter(Boolean);
        const languages = [
          ...new Set(
            data.flatMap((c) => (c.languages ? Object.values(c.languages) : []))
          ),
        ].filter(Boolean);
        const currencies = [
          ...new Set(
            data.flatMap((c) => (c.currencies ? Object.keys(c.currencies) : []))
          ),
        ].filter(Boolean);

        setUniqueFilters({
          regions: ["All", ...regions],
          subregions: ["All", ...subregions],
          capitals: ["All", ...capitals],
          languages: ["All", ...languages],
          currencies: ["All", ...currencies],
        });
      } catch (error) {
        console.error("Error fetching all countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCountries();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        let url;

        //endpoint to call based on active filters
        if (filters.region !== "All") {
          url = `https://restcountries.com/v3.1/region/${filters.region}`;
        } else if (filters.subregion !== "All") {
          url = `https://restcountries.com/v3.1/subregion/${filters.subregion}`;
        } else if (filters.capital !== "All") {
          url = `https://restcountries.com/v3.1/capital/${filters.capital}`;
        } else if (filters.language !== "All") {
          url = `https://restcountries.com/v3.1/lang/${filters.language}`;
        } else if (filters.currency !== "All") {
          url = `https://restcountries.com/v3.1/currency/${filters.currency}`;
        } else {
          //use all countries
          setFilteredCountries(countries);
          setCurrentPage(1);
          return;
        }

        const response = await fetch(url);
        const data = await response.json();
        const sortedCountries = Array.isArray(data)
          ? data.sort((a, b) => a.name.common.localeCompare(b.name.common))
          : [];

        setFilteredCountries(sortedCountries);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setFilteredCountries([]);
      } finally {
        setLoading(false);
      }
    };

    // fetch if any filter is active (not "All")
    if (Object.values(filters).some((filter) => filter !== "All")) {
      fetchFilteredData();
    } else {
      // all filters are "All", show all countries
      setFilteredCountries(countries);
      setCurrentPage(1);
    }
  }, [filters, countries]);

  // handle search separately
  useEffect(() => {
    if (searchTerm) {
      const results = filteredCountries.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(results);
      setCurrentPage(1);
    } else if (Object.values(filters).every((filter) => filter === "All")) {
      // If no search term and no filters show all
      setFilteredCountries(countries);
    }
  }, [searchTerm, filters, countries, filteredCountries]);

  // Get current countries for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  const handleFilterChange = (filterName, value) => {
    // Reset other filters when setting a new one
    setFilters({
      region: "All",
      subregion: "All",
      capital: "All",
      language: "All",
      currency: "All",
      [filterName]: value,
    });
  };

  const handleRegionSelect = (region) => {
    handleFilterChange("region", region === filters.region ? "All" : region);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          Explore Countries
        </h1>

        {/* Region Image Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Filter by Region
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {regions.map((region) => (
              <button
                key={region.name}
                onClick={() => handleRegionSelect(region.name)}
                className={`relative h-32 rounded-lg overflow-hidden group transition-all duration-300 ${
                  filters.region === region.name
                    ? "ring-4 ring-purple-500"
                    : "hover:ring-2 hover:ring-purple-300"
                }`}
              >
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300 ${
                    filters.region === region.name
                      ? "bg-opacity-60"
                      : "group-hover:bg-opacity-50"
                  }`}
                >
                  <span className="text-white font-bold text-lg drop-shadow-md">
                    {region.name}
                  </span>
                </div>
                {filters.region === region.name && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by country name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Region Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white"
                value={filters.region}
                onChange={(e) => handleFilterChange("region", e.target.value)}
              >
                {uniqueFilters.regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "All" ? "All Regions" : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Subregion Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white"
                value={filters.subregion}
                onChange={(e) =>
                  handleFilterChange("subregion", e.target.value)
                }
              >
                {uniqueFilters.subregions.map((subregion) => (
                  <option key={subregion} value={subregion}>
                    {subregion === "All" ? "All Subregions" : subregion}
                  </option>
                ))}
              </select>
            </div>

            {/* Capital Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white"
                value={filters.capital}
                onChange={(e) => handleFilterChange("capital", e.target.value)}
              >
                {uniqueFilters.capitals.map((capital) => (
                  <option key={capital} value={capital}>
                    {capital === "All" ? "All Capitals" : capital}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white"
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
              >
                {uniqueFilters.languages.map((language) => (
                  <option key={language} value={language}>
                    {language === "All" ? "All Languages" : language}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none bg-white"
                value={filters.currency}
                onChange={(e) => handleFilterChange("currency", e.target.value)}
              >
                {uniqueFilters.currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency === "All" ? "All Currencies" : currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count and Active Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="text-gray-600">
            {filteredCountries.length}{" "}
            {filteredCountries.length === 1 ? "country" : "countries"} found
          </div>

          {/* Active filters chips */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters)
              .filter(([_, value]) => value !== "All")
              .map(([key, value]) => (
                <span
                  key={`${key}-${value}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, "All")}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>

        {/* Countries Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Skeleton height={160} />
                <div className="p-4">
                  <Skeleton count={2} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {currentCountries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentCountries.map((country) => (
                  <Link
                    to={`/single-item/${country.name.common}`}
                    key={country.cca3}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={country.flags.png}
                        alt={`Flag of ${country.name.common}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="font-bold text-lg mb-2 text-gray-800 truncate">
                        {country.name.common}
                      </h2>
                      <p className="text-gray-600">
                        <span className="font-semibold">👨‍👩‍👧‍👦 Population:</span>{" "}
                        {country.population.toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">📌 Region:</span>{" "}
                        {country.region}
                      </p>
                      {country.capital && (
                        <p className="text-gray-600">
                          <span className="font-semibold">🏛️ Capital:</span>{" "}
                          {country.capital[0]}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  No countries found
                </h3>
                <p className="text-gray-600 mt-2">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {filteredCountries.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 rounded-md ${
                    currentPage === totalPages
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default Countries;
