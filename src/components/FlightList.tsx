import React from "react";
import { Box, Grid, Divider } from "@mui/material";
import FlightCard from "./FlightCard";

const FlightList = ({ flights }: { flights: any[] }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {flights.map((flight, index) => (
          <React.Fragment key={index}>
            {/* Flight Card */}
            <Grid item xs={12} sm={6} md={3}>
              <FlightCard
                airlineLogo={flight.legs[0].carriers.marketing[0].logoUrl}
                airlineName={flight.legs[0].carriers.marketing[0].name}
                departureTime={new Date(flight.legs[0].departure).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                arrivalTime={new Date(flight.legs[0].arrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                origin={flight.legs[0].origin.displayCode}
                destination={flight.legs[0].destination.displayCode}
                duration={`${Math.floor(flight.legs[0].durationInMinutes / 60)}h ${flight.legs[0].durationInMinutes % 60}m`}
                stops={flight.legs[0].stopCount === 0 ? "Direct" : `${flight.legs[0].stopCount} stop${flight.legs[0].stopCount > 1 ? "s" : ""}`}
                price={flight.price.formatted}
                isSponsored={flight.tags?.includes("sponsored")}
                emissionsInfo={flight.eco ? `This flight emits ${flight.eco.ecoContenderDelta}% less CO2 than a typical flight on this route.` : undefined}
              />
            </Grid>
            
            {/* Add divider after each row of 4 items */}
            {(index + 1) % 4 === 0 && index !== flights.length - 1 && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default FlightList;