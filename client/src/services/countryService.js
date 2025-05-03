const BASE_URL = "https://restcountries.com/v3.1";

export const getAllCountries = async () => {
  const response = await fetch(`${BASE_URL}/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
};

export const getCountryByName = async (name) => {
  const response = await fetch(`${BASE_URL}/name/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch country");
  }
  return response.json();
};

export const getCountriesByRegion = async (region) => {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries by region");
  }
  return response.json();
};

export const getCountryByCode = async (code) => {
  const response = await fetch(`${BASE_URL}/alpha/${code}`);
  if (!response.ok) {
    throw new Error("Failed to fetch country by code");
  }
  return response.json();
};
