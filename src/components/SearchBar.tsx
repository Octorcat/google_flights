"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers-pro";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FlightIcon from "@mui/icons-material/Flight";
import PublicIcon from "@mui/icons-material/Public";
import { useTheme } from "@mui/material/styles";
import { Airport } from "@/types/flight";
import { getAirports } from "@/app/api/flights/route";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

interface SearchBarProps {
  onSearch: (formData: {
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
  }) => void;
}

const cabinClasses = ["Economy", "Premium Economy", "Business Class", "First Class"];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const theme = useTheme();
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway");
  const [legs, setLegs] = useState([
    {
      departure: "",
      destination: "",
      originSkyId: "",
      originEntityId: "",
      destinationSkyId: "",
      destinationEntityId: "",
      outbound: moment().format("YYYY-MM-DD"),
      inbound: moment().format("YYYY-MM-DD"),
    },
  ]);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departure, setDeparture] = useState<Record<number, Airport[]>>([]);
  const [destination, setDestination] = useState<Record<number, Airport[]>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<Record<string, boolean>>({});

  const fetchAirports = useCallback(async (query: string, legIndex: number, field: "departure" | "destination") => {
    try {
      if (query.trim() === "") {
        field === "departure"
          ? setDeparture((prev) => ({ ...prev, [legIndex]: [] }))
          : setDestination((prev) => ({ ...prev, [legIndex]: [] }));
        return;
      }
      setLoadingSuggestions((prev) => ({ ...prev, [`${legIndex}-${field}`]: true }));
      const savedSettings = localStorage.getItem("regionalSettings");
      const regionalSettings = savedSettings ? JSON.parse(savedSettings) : 
        { 
          locale: "en-US",
          countryCode: "US",
          currency: "USD"
        };
      const results = await getAirports({ query, locale: regionalSettings.locale });
      if (field === "departure") {
        setDeparture((prev) => ({ ...prev, [legIndex]: results }));
      } else {
        setDestination((prev) => ({ ...prev, [legIndex]: results }));
      }
    } catch (error) {
      toast.error("Failed to fetch airport suggestions. Please try again.");
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [`${legIndex}-${field}`]: false }));
    }
  }, []);

  const debouncedFetchAirports = useDebouncedCallback(
    (query: string, legIndex: number, field: "departure" | "destination") => {
      fetchAirports(query.trim(), legIndex, field);
    },
    1000
  );

  const handleTripTypeChange = (_: React.MouseEvent<HTMLElement>, newTripType: "roundtrip" | "oneway" | "multicity" | null) => {
    if (!newTripType) return;
    setTripType(newTripType);

    const initialLeg = { 
      departure: "", 
      destination: "", 
      originSkyId: "",
      originEntityId: "",
      destinationSkyId: "",
      destinationEntityId: "",
      outbound: moment().format("YYYY-MM-DD"), 
      inbound: moment().format("YYYY-MM-DD") 
    };

    setLegs(newTripType === "multicity" ? [initialLeg, { ...initialLeg, inbound: moment().add(7, "days").format("YYYY-MM-DD") }] : [initialLeg]);
  };

  const handleLegChange = (index: number, field: "departure" | "destination" | "outbound" | "inbound", value: string) => {
    const updatedLegs = [...legs];
    updatedLegs[index][field] = value;
    setLegs(updatedLegs);
  };

  const handleChildrenChange = (value: number) => {
    setChildren(value);
  
    setChildrenAges((prevAges) => {
      if (value > prevAges.length) {
        return [...prevAges, ...Array(value - prevAges.length).fill(10)];
      }
      
      return prevAges.slice(0, value);
    });
  };

  const handleChildAgeChange = (index: number, age: string) => {
    const sanitizedAge = parseInt(age, 10);
    setChildrenAges((prevAges) =>
      prevAges.map((a, i) => (i === index ? sanitizedAge : a))
    );
  };

  const addLeg = () => {
    setLegs([...legs, { 
      departure: "", 
      destination: "", 
      originSkyId: "",
      originEntityId: "",
      destinationSkyId: "",
      destinationEntityId: "",
      outbound: moment().format("YYYY-MM-DD"), 
      inbound: moment().format("YYYY-MM-DD") }
    ]);
  };

  const removeLeg = (index: number) => {
    setLegs(legs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch(tripType) {
      case 'oneway':
        if (!legs[0].originEntityId || !legs[0].originSkyId || !legs[0].destinationSkyId || !legs[0].destinationEntityId || !legs[0].outbound) {
          toast("Please fill in from, to, departure date.")
          return;
        }
        break;
      case 'roundtrip':
        if (!legs[0].originEntityId || !legs[0].originSkyId || !legs[0].destinationSkyId || !legs[0].destinationEntityId || !legs[0].outbound || !legs[0].inbound || (legs[0].outbound === legs[0].inbound)) {
          toast("Please fill in all required fields.");
          return;
        }
        break;
      default :
        if (legs.length < 1) {
          toast("At least 2 items must be filled in.");
          return;
        }

        for (let i = 0; i < legs.length; i++) {
          if (
            !legs[i].originEntityId ||
            !legs[i].originSkyId ||
            !legs[i].destinationSkyId ||
            !legs[i].destinationEntityId ||
            !legs[i].outbound
          ) {
            toast("Please enter all values accurately.");
            return;
          }
          if (i > 0 && legs[i - 1].outbound > legs[i].inbound) {
            toast("Check overlapping outbound and inbound dates for multi-city trips.");
            return;
          }
        }

        break;
    }

    onSearch({ tripType, legs, adults, children, cabinClass, childrenAges });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalApply = (newAdults: number, newChildren: number, newCabinClass: string) => {
    setAdults(newAdults);
    setChildren(newChildren);
    setCabinClass(newCabinClass);
    closeModal();
  };

  const handleAirportSelect = (legIndex: number, field: "departure" | "destination", airport: Airport) => {
    const updatedLegs = [...legs];
    setLegs(updatedLegs);

    if (field === "departure") {
      updatedLegs[legIndex].departure = airport.presentation.suggestionTitle;
      updatedLegs[legIndex].originSkyId = airport.skyId;
      updatedLegs[legIndex].originEntityId = airport.entityId;
      setDeparture((prev) => ({ ...prev, [legIndex]: [] }));
    } else {
      updatedLegs[legIndex].destination = airport.presentation.suggestionTitle;
      updatedLegs[legIndex].destinationSkyId = airport.skyId;
      updatedLegs[legIndex].destinationEntityId = airport.entityId;
      setDestination((prev) => ({ ...prev, [legIndex]: [] }));
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: 3,
          padding: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          color: theme.palette.text.primary,
          gap: 3,
        }}
      >
        {/* Trip Type Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={tripType}
            exclusive
            onChange={handleTripTypeChange}
            sx={{
              "& .MuiToggleButton-root": {
                color: theme.palette.text.primary,
                border: "1px solid ${theme.palette.divider}",
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
                flex: 1,
                minWidth: {
                  xs: "40px",
                  sm: "100px",
                },
                fontSize: {
                  xs: "10px",
                  sm: "14px",
                },
              },
            }}
          >
            <ToggleButton value="roundtrip">Roundtrip</ToggleButton>
            <ToggleButton value="oneway">One way</ToggleButton>
            <ToggleButton value="multicity">Multi-city</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Search Fields */}
        {legs.map((leg, index) => (
          <Grid container spacing={2} key={`leg-${index}`} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="From"
                value={leg.departure}
                onChange={(e) => {
                  handleLegChange(index, "departure", e.target.value);
                  debouncedFetchAirports(e.target.value, index, "departure");
                }}
                fullWidth
                InputProps={{
                  endAdornment: loadingSuggestions[`${index}-departure`] ? <CircularProgress size={20} /> : null,
                }}
              />
              {departure[index] && departure[index].length > 0 && (
                <Box 
                  sx={{ 
                    position: "absolute", 
                    background: theme.palette.background.default, 
                    zIndex: 10
                  }}
                >
                  {departure[index].map((airport) => (
                    <Box
                      key={airport.navigation.entityId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        cursor: "pointer",
                        color: theme.palette.text.primary,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                      onClick={() => handleAirportSelect(index, "departure", airport)}
                    >
                      {airport.navigation.entityType === "CITY" && (
                        <LocationCityIcon sx={{ marginRight: "8px", color: theme.palette.text.secondary }} />
                      )}
                      {airport.navigation.entityType === "AIRPORT" && (
                        <FlightIcon sx={{ marginRight: "8px", color: theme.palette.text.secondary }} />
                      )}
                      {airport.navigation.entityType === "COUNTRY" && (
                        <PublicIcon sx={{ marginRight: "8px", color: theme.palette.text.secondary }} />
                      )}
                    
                      <div>
                        <Typography>{airport.presentation.suggestionTitle}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {airport.presentation.subtitle}
                        </Typography>
                      </div>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="To"
                value={leg.destination}
                onChange={(e) => {
                  handleLegChange(index, "destination", e.target.value);
                  debouncedFetchAirports(e.target.value, index, "destination");
                }}
                fullWidth
                InputProps={{
                  endAdornment: loadingSuggestions[`${index}-destination`] ? <CircularProgress size={20} /> : null,
                }}
              />
              {destination[index] && destination[index].length > 0 && (
                <Box sx={{ position: "absolute", background: theme.palette.background.default, zIndex: 10 }}>
                  {destination[index].map((airport) => (
                    <Box
                      key={airport.navigation.entityId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        cursor: "pointer",
                        color: theme.palette.text.primary,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                      onClick={() => handleAirportSelect(index, "destination", airport)}
                    >
                      {/* Icon based on entityType */}
                      {airport.navigation.entityType === "CITY" && (
                        <LocationCityIcon sx={{ marginRight: "8px", color: theme.palette.text.secondary }} />
                      )}
                      {airport.navigation.entityType === "AIRPORT" && (
                        <FlightIcon sx={{ marginRight: "8px", color: theme.palette.text.secondary }} />
                      )}
                      {airport.navigation.entityType === "COUNTRY" && (
                        <PublicIcon sx={{ marginRight: "8px", color: theme.palette.text.secondary }} />
                      )}
                    
                      {/* Text Content */}
                      <div>
                        <Typography>{airport.presentation.suggestionTitle}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {airport.presentation.subtitle}
                        </Typography>
                      </div>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={tripType === "multicity" ? 5 : 4}>
              <Box display="flex" gap={2} alignItems="center" height="100%">
                <DatePicker
                  label="Departure Date"
                  value={moment(leg.outbound)}
                  onChange={(newDate) =>
                    handleLegChange(index, "outbound", newDate?.format("YYYY-MM-DD") || "")
                  }
                  minDate={moment()}
                  slots={{openPickerIcon: FlightTakeoffIcon}}
                />
                <DatePicker
                  label="Return Date"
                  value={moment(leg.inbound)}
                  onChange={(newDate) =>
                    handleLegChange(index, "inbound", newDate?.format("YYYY-MM-DD") || "")
                  }
                  disabled={tripType === "oneway"}
                  minDate={moment()}
                  slots={{openPickerIcon: FlightLandIcon}}
                />
              </Box>
            </Grid>
            {tripType === "multicity" ? (
              <Grid item xs={12} sm={1}>
                <IconButton onClick={() => removeLeg(index)} color="error">
                  <CloseIcon />
                </IconButton>
              </Grid>
            ): (<Grid item xs={12} sm={2}>
              <Box
                onClick={openModal}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 16px",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: "pointer",
                  height: "56px",
                  boxSizing: "border-box",
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                  },
                }}
              >
                <Tooltip title={`Cabin Class: ${cabinClass}, Travelers: ${adults + children}`}>
                  <Typography>{cabinClass}, {adults + children}</Typography>
                </Tooltip>
              </Box>
            </Grid>)}
          </Grid>
        ))}

        {tripType === "multicity" && (
          <Button onClick={addLeg} variant="outlined" sx={{ alignSelf: "start", color: theme.palette.primary.main }}>
            Add Leg
          </Button>
        )}

        {/* Submit Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: tripType === "multicity" ? "space-between" : "flex-end",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {tripType === "multicity" && (
            <Box
              onClick={openModal}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                padding: "8px 16px", // Consistent padding
                borderRadius: 1,
                cursor: "pointer",
                height: "56px",
                minWidth: "200px", // Minimum width for readability
                boxSizing: "border-box",
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                },
              }}
            >
              <Typography
                sx={{
                  textAlign: "center", // Center text inside the box
                  fontSize: "0.9rem", // Adjust font size for readability
                  lineHeight: 1.2,
                }}
              >
                {cabinClass}, {adults + children} Traveler(s)
              </Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              paddingX: 4,
              paddingY: 1.5,
              fontSize: "1rem",
              borderRadius: 3,
              minWidth: "150px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Search
          </Button>
        </Box>

        <Dialog open={isModalOpen} onClose={closeModal} maxWidth="xs" fullWidth>
          <DialogTitle>Travelers and Cabin Class</DialogTitle>
          <DialogContent>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                Cabin class
              </Typography>
              <TextField
                select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                fullWidth
              >
                {cabinClasses.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {/* Adults Counter */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <Box>
                <Typography>Adults</Typography>
                <Typography variant="caption">Age 16+</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  size="small"
                  color="primary"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ marginX: 2 }}>{adults}</Typography>
                <IconButton onClick={() => setAdults(adults + 1)} size="small" color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Children Counter */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <Box>
                <Typography>Children</Typography>
                <Typography variant="caption">Age 0 to 15</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => handleChildrenChange(children - 1)}
                  disabled={children <= 0}
                  size="small"
                  color="primary"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ marginX: 2 }}>{children}</Typography>
                <IconButton onClick={() => handleChildrenChange(children + 1)} size="small" color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Children Ages */}
            {children > 0 &&
              Array.from({ length: children }, (_, index) => (
                <Box key={`child-age-${index}`} marginBottom={2}>
                  <Typography>Age of Child {index + 1}</Typography>
                  <TextField
                    select
                    value={childrenAges[index] ?? ""}
                    onChange={(e) => handleChildAgeChange(index, e.target.value)}
                    fullWidth
                  >
                    {Array.from({ length: 16 }, (_, i) => (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              ))}

            <Typography variant="caption" color="textSecondary">
              Your age at the time of travel must be valid for the age category booked. Airlines have restrictions
              on people under the age of 18 traveling alone.
              <br />
              <br />
              Age limits and policies for traveling with children may vary, so please check with the airline
              before booking.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleModalApply(adults, children, cabinClass)} variant="contained" color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SearchBar;