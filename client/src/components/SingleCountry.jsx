import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const SingleCountry = () => {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exploreCountries, setExploreCountries] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);

  let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  function CountryMap({ latlng, name }) {
    if (!latlng) return null;

    return (
      <MapContainer
        center={latlng}
        zoom={5}
        className="w-full h-96 rounded-lg shadow-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={latlng}>
          <Popup>{name.common}</Popup>
        </Marker>
      </MapContainer>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch main country data
        const countryResponse = await fetch(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );

        if (!countryResponse.ok) {
          throw new Error("Country not found");
        }

        const countryData = await countryResponse.json();
        setCountry(countryData[0]);

        // Fetch explore countries
        const exploreResponse = await fetch(
          `https://restcountries.com/v3.1/all`
        );
        if (!exploreResponse.ok) {
          throw new Error("Failed to load explore countries");
        }
        const exploreData = await exploreResponse.json();

        // Get 5 random countries (excluding the current one)
        const filtered = exploreData.filter(
          (c) => c.cca3 !== countryData[0]?.cca3
        );
        const randomCountries = filtered
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setExploreCountries(randomCountries);
      } catch (err) {
        setError(err.message);

        // If main country fails, still try to load explore countries
        try {
          const exploreResponse = await fetch(
            `https://restcountries.com/v3.1/all`
          );
          if (exploreResponse.ok) {
            const exploreData = await exploreResponse.json();
            const randomCountries = exploreData
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);
            setExploreCountries(randomCountries);
          }
        } catch (exploreErr) {
          console.error("Failed to load explore countries:", exploreErr);
        }
      } finally {
        setIsLoading(false);
        setExploreLoading(false);
      }
    };

    fetchData();
  }, [name]);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="spinner-border text-primary" role="status"></div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-red-600">
            Country not found
          </h2>
          <p className="text-gray-600 mt-2">
            "{name}" doesn't match any country. Please check the spelling.
          </p>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-blue-600 mb-6 text-center">
            Explore These Countries Instead
          </h3>
          {exploreLoading ? (
            <div className="text-center py-8">
              <div className="spinner-border text-primary" role="status"></div>
              <p>Loading suggestions...</p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto py-4 px-2 hover:cursor-pointer">
              {exploreCountries.map((c) => (
                <Link
                  to={`/single-item/${encodeURIComponent(
                    c.name.common.toLowerCase()
                  )}`}
                  key={c.cca3}
                >
                  <div
                    key={c.cca3}
                    className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={c.flags.png}
                      alt={c.name.common}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-medium text-gray-800">
                        {c.name.common}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {c.region} • {c.population.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 text-gray-700 mt-28">
      {/* Main Country Info */}
      <div className="flex flex-wrap gap-8 items-center mb-12 border-b pb-8">
        <div className="flex gap-4 items-center">
          <motion.img
            src={country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-52 border border-gray-300 shadow-lg"
            animate={{
              y: ["0px", "-10px", "0px"],
              transition: {
                y: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  ease: "easeInOut",
                },
              },
            }}
          />
          {country.coatOfArms?.png && (
            <img
              src={country.coatOfArms.png}
              alt={`Coat of arms of ${country.name.common}`}
              className="w-24 border border-gray-300 p-2 bg-white shadow-lg"
            />
          )}
        </div>
        <div className="flex-1 min-w-[300px]">
          <h1 className="text-4xl font-semibold text-blue-600">
            {country.name.common}
          </h1>
          <h2 className="text-xl font-light mt-2 text-gray-600">
            {country.name.official}
          </h2>
          {country.name.nativeName && (
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
              {Object.entries(country.name.nativeName).map(
                ([langCode, names]) => (
                  <p key={langCode} className="text-sm">
                    <strong className="text-blue-600">
                      {country.languages?.[langCode] || langCode}:
                    </strong>{" "}
                    {names.common} ({names.official})
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Country Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            Basic Information
          </h3>
          <ul className="space-y-2">
            <li>
              <strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}{" "}
              {country.maps?.googleMaps && (
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 underline text-sm"
                >
                  (View on Map)
                </a>
              )}
            </li>
            <li>
              <strong>Region:</strong> {country.region}{" "}
              {country.subregion && `(${country.subregion})`}
            </li>
            <li>
              <strong>Population:</strong> {country.population.toLocaleString()}
            </li>
            <li>
              <strong>Area:</strong> {country.area.toLocaleString()} km²
            </li>
            {country.timezones && (
              <li>
                <strong>Timezone:</strong> {country.timezones.join(", ")}
              </li>
            )}
            {country.startOfWeek && (
              <li>
                <strong>Start of Week:</strong> {country.startOfWeek}
              </li>
            )}
          </ul>
        </div>

        {/* Codes & Identification Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
          <h3 className="text-lg font-semibold text-green-600 mb-4">
            Codes & Identification
          </h3>
          <ul className="space-y-2">
            {country.tld && (
              <li>
                <strong>Top Level Domain:</strong> {country.tld.join(", ")}
              </li>
            )}
            <li>
              <strong>ISO Codes:</strong> {country.cca2}, {country.cca3}
              {country.ccn3 && `, ${country.ccn3}`}
            </li>
            {country.fifa && (
              <li>
                <strong>FIFA Code:</strong> {country.fifa}
              </li>
            )}
            {country.cioc && (
              <li>
                <strong>CIOC Code:</strong> {country.cioc}
              </li>
            )}
            <li>
              <strong>UN Member:</strong> {country.unMember ? "Yes" : "No"}
            </li>
            {country.status && (
              <li>
                <strong>Status:</strong> {country.status}
              </li>
            )}
          </ul>
        </div>

        {/* Currency Card */}
        {country.currencies && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-teal-600">
            <h3 className="text-lg font-semibold text-teal-600 mb-4">
              Currency
            </h3>
            {Object.entries(country.currencies).map(([code, currency]) => (
              <p key={code} className="text-sm">
                <strong>{code}:</strong> {currency.name} ({currency.symbol})
              </p>
            ))}
          </div>
        )}

        {/* Languages Card */}
        {country.languages && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-600">
            <h3 className="text-lg font-semibold text-yellow-600 mb-4">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(country.languages).map(([code, language]) => (
                <span
                  key={code}
                  className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm"
                >
                  {language} ({code.toUpperCase()})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Demonyms Card */}
        {country.demonyms && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
            <h3 className="text-lg font-semibold text-purple-600 mb-4">
              Demonyms
            </h3>
            <ul className="space-y-2">
              {Object.entries(country.demonyms).map(([lang, demonym]) => (
                <li key={lang} className="text-sm">
                  <strong>{lang.toUpperCase()}:</strong> {demonym.m} (male),{" "}
                  {demonym.f} (female)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Translations Card */}
        {/* {country.translations && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-400">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">
              Translations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(country.translations).map(
                ([lang, translation]) => (
                  <div key={lang} className="p-4 bg-blue-50 rounded-lg">
                    <strong>{lang.toUpperCase()}:</strong> {translation.common}{" "}
                    ({translation.official})
                  </div>
                )
              )}
            </div>
          </div>
        )} */}
      </div>

      {/* Map Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {country.maps?.googleMaps && (
          <div>
            <CountryMap latlng={country.latlng} name={country.name} />
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Geography
          </h3>
          {country.latlng && (
            <p>
              <strong>Coordinates:</strong> Latitude: {country.latlng[0]},
              Longitude: {country.latlng[1]}
            </p>
          )}
          <p>
            <strong>Landlocked:</strong> {country.landlocked ? "Yes" : "No"}
          </p>
          {country.borders && country.borders.length > 0 && (
            <p>
              <strong>Borders:</strong> {country.borders.join(", ")}
            </p>
          )}
          {country.car && (
            <p>
              <strong>Driving Side:</strong> {country.car.side} (Signs:{" "}
              {country.car.signs?.join(", ")})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCountry;
