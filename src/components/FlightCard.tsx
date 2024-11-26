import React from "react";
import { Card, CardContent, Box, Typography, Button, Divider, Grid } from "@mui/material";

interface FlightCardProps {
  airlineLogo: string;
  airlineName: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  duration: string;
  stops: string;
  price: string;
  isSponsored?: boolean;
  emissionsInfo?: string;
}

const FlightCard: React.FC<FlightCardProps> = ({
  airlineLogo,
  airlineName,
  departureTime,
  arrivalTime,
  origin,
  destination,
  duration,
  stops,
  price,
  isSponsored = false,
  emissionsInfo,
}) => {
  return (
    <Card sx={{ marginBottom: 2, borderRadius: 3, boxShadow: 2, height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          {/* Airline Info */}
          <Box display="flex" alignItems="center" gap={1}>
            <img src={airlineLogo} alt={`${airlineName} logo`} style={{ height: 40 }} />
            <Typography variant="body1" fontWeight="bold">
              {airlineName}
            </Typography>
          </Box>

          {/* Sponsored Label */}
          {isSponsored && (
            <Typography variant="caption" color="primary" fontWeight="bold">
              Sponsored
            </Typography>
          )}
        </Box>

        {/* Flight Times */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box textAlign="center">
            <Typography variant="h6">{departureTime}</Typography>
            <Typography variant="body2" color="textSecondary">
              {origin}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {duration}
          </Typography>
          <Box textAlign="center">
            <Typography variant="h6">{arrivalTime}</Typography>
            <Typography variant="body2" color="textSecondary">
              {destination}
            </Typography>
          </Box>
        </Box>

        {/* Stops Information */}
        <Box textAlign="center" mb={2}>
          <Typography variant="body2" color={stops === "Direct" ? "primary" : "error"}>
            {stops}
          </Typography>
        </Box>

        <Divider sx={{ marginBottom: 2 }} />

        {/* Pricing and CTA */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            {price}
          </Typography>
          <Button variant="contained" color="primary">
            Select
          </Button>
        </Box>

        {/* Emissions Info */}
        {emissionsInfo && (
          <Typography variant="caption" color="textSecondary" mt={1} display="block">
            {emissionsInfo}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightCard;
