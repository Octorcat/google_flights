"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FlightResponse } from "@/types/flight";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import FlightList from "@/components/FlightList";
import { searchFlights } from "./api/flights/route";

export default function Home() {
  const [flights, setFlights] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (formData: {
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
  }) => {
    setLoading(true);
    try {
      const savedSettings = localStorage.getItem("regionalSettings");
      const regionalSettings = savedSettings ? JSON.parse(savedSettings) : 
        { 
          locale: "en-US",
          countryCode: "US",
          currency: "USD"
        };

      const flightResults = await searchFlights(formData, regionalSettings) as FlightResponse;

      
      flightResults !== null ? setFlights(flightResults.data.itineraries) : setFlights([]);
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Flights Search
      </Typography>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <Typography>Loading flights...</Typography>
      ) : (
        <FlightList flights={flights} />
      )}
    </Container>
  );
}
