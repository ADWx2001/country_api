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
        <div className="text-xl font-semibold text-gray-600">
          <img
            src={
              "https://cliply.co/wp-content/uploads/2021/02/392102850_EARTH_EMOJI_400px.gif"
            }
            className="w-12 md:w-16"
            alt="Finova Logo"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ml-10 mr-10 mt-20">
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 rounded-b-3xl shadow-lg mb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
            Discover the World with Country Explorer
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto">
            Your interactive gateway to exploring countries, their cultures, and
            identities visually stunning and easy to navigate.
          </p>
          <a
            href="/countries"
            className="bg-white text-indigo-600 hover:bg-gray-200 font-semibold px-8 py-3 rounded-full transition duration-300 shadow"
          >
            Start Exploring
          </a>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white opacity-70 animate-bounce">
          ↓
        </div>
      </section>

      {/* Carousel Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Explore Featured Countries
        </h2>
        <div className="relative max-w-5xl mx-auto overflow-hidden rounded-xl shadow-xl bg-gray-100">
          {/* Carousel Slides */}
          {countries.length > 0 && (
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {countries.map((country) => (
                <div
                  key={country.cca3}
                  className="min-w-full flex flex-col items-center p-8 bg-white transition-shadow duration-300"
                >
                  <img
                    src={country.flags.png}
                    alt={`${country.name.common} flag`}
                    className="w-64 h-40 object-cover rounded-md mb-4 shadow-md transition-transform duration-300 hover:scale-105"
                  />
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {country.name.common}
                  </h3>
                  <p className="text-gray-600 text-lg mb-1">
                    Capital:{" "}
                    <span className="font-medium">
                      {country.capital?.[0] || "N/A"}
                    </span>
                  </p>
                  <p className="text-gray-600 text-lg">
                    Region: {country.region}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg transition"
          >
            <span className="text-2xl">&larr;</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg transition"
          >
            <span className="text-2xl">&rarr;</span>
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-6 pb-4">
            {countries.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 mx-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-indigo-600 scale-125"
                    : "bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
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
