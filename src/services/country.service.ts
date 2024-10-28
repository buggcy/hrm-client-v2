import axios from 'axios';

const apiKey = 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==';
const apiUrl = 'https://api.countrystatecity.in/v1/countries';

export const fetchCountries = async () => {
  const response = await axios.get(apiUrl, {
    headers: { 'X-CSCAPI-KEY': apiKey },
  });
  return response.data;
};

export const fetchStates = async (countryCode: string) => {
  const response = await axios.get(`${apiUrl}/${countryCode}/states`, {
    headers: { 'X-CSCAPI-KEY': apiKey },
  });
  return response.data;
};

export const fetchCities = async (countryCode: string, stateCode: string) => {
  const response = await axios.get(
    `${apiUrl}/${countryCode}/states/${stateCode}/cities`,
    {
      headers: { 'X-CSCAPI-KEY': apiKey },
    },
  );
  return response.data;
};
