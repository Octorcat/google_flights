import axios from "axios";
import { LocaleResponse, ConfigResponse, LanguageData, ConfigData, AirportsResponse, Airport } from "@/types/flight";
import { mapCabinClass, splitChildrenAndInfants } from "@/utils/helpers";

const skyScrapperApi = axios.create({
  baseURL: `https://${process.env.NEXT_PUBLIC_SKYSCANNER_HOST}`,
  headers: {
    'x-rapidapi-key': process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY,
    'x-rapidapi-host': process.env.NEXT_PUBLIC_SKYSCANNER_HOST,
  },
  method: 'GET',
});

export const getConfig = async (): Promise<{ language: Array<LanguageData> | undefined, countries: Array<ConfigData> | undefined }> => {
  const localeEndpoint = `/api/v1/getLocale`;
  const configEndpoint = `/api/v1/getConfig`;

  try {
    const [localeResponse, configResponse] = await Promise.all([
      skyScrapperApi.get<LocaleResponse>(localeEndpoint),
      skyScrapperApi.get<ConfigResponse>(configEndpoint)
    ]);

    if (!localeResponse.data.status || !configResponse.data.status) {
      console.error("Invalid response data from locale or config endpoint");
      return {
        language: undefined,
        countries: undefined,
      };
    }

    return {
      language: localeResponse.data.data || undefined,
      countries: configResponse.data.data || undefined,
    };
  } catch (error) {
    console.log(`Error fetching config from ${localeEndpoint} or ${configEndpoint}: ${error}`);
    return {
      language: undefined,
      countries: undefined,
    };
  }
}

export const getAirports = async (params: { query: string; locale: string }): Promise<Array<Airport>> => {
  const endpoint = `/api/v1/flights/searchAirport?query=${params.query}&locale=${params.locale}`;

  try {
    const response = await skyScrapperApi.get<AirportsResponse>(endpoint);
    console.log(`Response from ${endpoint}: `, response.data);
    return response.data?.status === true ? response.data.data as Array<Airport>: [];
  } catch (error) {
    console.error(`Error fetching config from ${endpoint}: ${error}`);
    return [];
  }
}

export const searchFlights = async (formData: {
  tripType: "oneway" | "roundtrip" | "multicity";
  legs: Array<{
    departure: string;
    destination: string;
    outbound: string;
    inbound: string;
    originSkyId: string;
    originEntityId: string;
    destinationSkyId: string;
    destinationEntityId: string;
  }>;
  adults: number;
  children: number;
  cabinClass: string;
  childrenAges: number[];
}, regionalSettings: {
  locale: string;
  countryCode: string;
  currency: string;
}) => {
  const endpoint = `/api/v2/flights/searchFlights`;

  try {
    let params;
    const { infants, childrens } = splitChildrenAndInfants(formData.childrenAges);
    switch(formData.tripType) {
      case "oneway":
        params = {
          originSkyId: formData.legs[0].originSkyId,
          originEntityId: formData.legs[0].originEntityId,
          destinationSkyId: formData.legs[0].destinationSkyId,
          destinationEntityId: formData.legs[0].destinationEntityId,
          date: formData.legs[0].outbound,
          cabinClass: mapCabinClass(formData.cabinClass),
          adults: formData.adults,
          childrens,
          infants,
          currency: regionalSettings.currency,
          countryCode: regionalSettings.countryCode
        }
        break;
      case "roundtrip":
        params = {
          originSkyId: formData.legs[0].originSkyId,
          originEntityId: formData.legs[0].originEntityId,
          destinationSkyId: formData.legs[0].destinationSkyId,
          destinationEntityId: formData.legs[0].destinationEntityId,
          date: formData.legs[0].outbound,
          returnDate: formData.legs[0].inbound,
          cabinClass: mapCabinClass(formData.cabinClass),
          adults: formData.adults,
          childrens,
          infants,
          currency: regionalSettings.currency,
          countryCode: regionalSettings.countryCode
        }
        break;
      case "multicity":
        break;
      default:

        break;
    }
    const response = await skyScrapperApi.get(endpoint, { params });
    console.log(`Response from ${endpoint}:`, response.data);

    if (response.data?.status !== true) {
      console.error(`Invalid flight search response:`, response.data);
      return null;
    }

    return response.data || null;
  } catch (error) {
    console.error(`Error searching flights: ${error}`);
    return null;
  }
};