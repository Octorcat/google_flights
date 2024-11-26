export interface FlightResponse {
  status: boolean;
  timestamp: number;
  sessionId: string;
  data: any;
}

export interface LocaleResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: Array<LanguageData>
}

export interface LanguageData {
  text: string;
  id: string;
}

export interface ConfigResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: Array<ConfigData>
}

export interface ConfigData {
  country: string;
  countryCode: string;
  market: string;
  currencyTitle: string;
  currency: string;
  currencySymbol: string;
  site: string;
}

export interface AirportsResponse {
  status: boolean;
  timestamp: number;
  data: Array<Airport>;
}

export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    entityId: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
    relevantHotelParams: {
      entityId: string;
      entityType: string;
      localizedName: string;
    };
  };
}
