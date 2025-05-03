import React, { useState, useEffect } from "react";
import { getAllCountries } from "../services/countryService";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch countries from the REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        // Limit to 5 countries for the carousel
        setCountries(data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Handle carousel navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % countries.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + countries.length) % countries.length
    );
  };

  if (loading) {
    return (
      <div className="ml-10 mt-20 flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="ml-10 mr-10 mt-20">
      {/* Carousel Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Explore Featured Countries
        </h2>
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            {countries.length > 0 && (
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {countries.map((country) => (
                  <div
                    key={country.cca3}
                    className="min-w-full flex flex-col items-center p-6 bg-white"
                  >
                    <img
                      src={country.flags.png}
                      alt={`${country.name.common} flag`}
                      className="w-64 h-40 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {country.name.common}
                    </h3>
                    <p className="text-gray-600">
                      Capital: {country.capital?.[0] || "N/A"}
                    </p>
                    <p className="text-gray-600">Region: {country.region}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            &larr;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            &rarr;
          </button>
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4">
            {countries.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${
                  index === currentIndex ? "bg-gray-800" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb- font-sans mb-5">
          Welcome to Country Explorer
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Country Explorer is your gateway to discovering the world! Powered by
          the REST Countries API, this web app allows you to browse, search, and
          filter countries based on name, region, or language. Dive into
          detailed information about each country, including its capital,
          population, flag, and more. Whether you're a traveler, student, or
          curious explorer, our intuitive and responsive interface makes
          learning about countries fun and engaging.
        </p>
        <a
          href="/countries"
          className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
        >
          Start Exploring
        </a>
      </section>
    </div>
  );
}
