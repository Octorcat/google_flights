"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const cabinClasses = ["Economy", "Premium Economy", "Business Class", "First Class"];

interface TravelerModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: { cabinClass: string; adults: number; children: number }) => void;
}

const TravelerModal: React.FC<TravelerModalProps> = ({ open, onClose, onApply }) => {
  const [cabinClass, setCabinClass] = useState<string>("Economy");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const handleApply = () => {
    onApply({ cabinClass, adults, children });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Travelers and Cabin Class</DialogTitle>
      <DialogContent>
        {/* Cabin Class Dropdown */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Cabin class
          </Typography>
          <TextField
            select
            fullWidth
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            variant="outlined"
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
              onClick={() => setChildren(Math.max(0, children - 1))}
              disabled={children <= 0}
              size="small"
              color="primary"
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ marginX: 2 }}>{children}</Typography>
            <IconButton onClick={() => setChildren(children + 1)} size="small" color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Information Section */}
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TravelerModal;
