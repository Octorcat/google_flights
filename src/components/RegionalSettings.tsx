"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { ConfigData, LanguageData } from "@/types/flight";
import { getConfig } from "@/app/api/flights/route";

interface RegionalSettingsProps {
  open: boolean;
  onClose: () => void;
}

interface Country {
  name: string;
  countryCode: string;
  currency: string;
}

interface Currency {
  name: string;
  symbol: string;
}

const popularCurrencies = ["USD", "EUR", "GBP"];

const RegionalSettings: React.FC<RegionalSettingsProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [settings, setSettings] = useState({
    locale: "",
    countryCode: "",
    currency: "",
  });

  // Fetch country and currency data
  const fetchCountriesWithCurrencies = async () => {
    setLoading(true);
    try {
      const config = await getConfig();

      if (!config.language || !config.countries) {
        console.error("Failed to load languages or countries from config");
        return;
      }

      setLanguages(config.language);

      const data = config.countries.map((configData: ConfigData) => {
        return {
          name: configData.country,
          countryCode: configData.countryCode,
          currency: configData.currency,
        };
      });

      const sortedCountries = data.sort((a, b) => a.name.localeCompare(b.name));

      const data1 = config.countries.map((configData: ConfigData) => {
        return {
          name: configData.currency,
          symbol: configData.currencySymbol
        };
      });

      const uniqueCurrencySet = Array.from(
        new Map(data1.map((currency) => [currency.name, currency])).values()
      );

      const sortedUniqueCurrencies = uniqueCurrencySet.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const popular = sortedUniqueCurrencies.filter((currency) => popularCurrencies.includes(currency.name));
      const other = sortedUniqueCurrencies.filter((currency) => !popularCurrencies.includes(currency.name));

      setCountries(sortedCountries);
      setCurrencies([...popular, ...other]);
    } catch (error) {
      console.error("Error fetching countries with currencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("regionalSettings", JSON.stringify(settings));
  };

  const loadFromLocalStorage = () => {
    const savedSettings = localStorage.getItem("regionalSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  useEffect(() => {
    fetchCountriesWithCurrencies();
    loadFromLocalStorage();
  }, []);

  const handleCountryChange = (event: any, value: Country | null) => {
    setSettings((prev) => ({
      ...prev,
      countryCode: value?.countryCode || "",
      currency: value?.currency || "",
    }));
  };

  const handleCurrencyChange = (event: any, value: Currency | null) => {
    setSettings((prev) => ({
      ...prev,
      currency: value?.name || "",
    }));
  };

  const handleSave = () => {
    saveToLocalStorage();
    console.log("Saved Settings:", settings);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="regional-settings-dialog"
      aria-describedby="regional-settings-description"
    >
      <DialogTitle id="regional-settings-dialog">Regional Settings</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <Autocomplete
              options={languages}
              getOptionLabel={(option) => option.text || ""}
              value={languages.find((lang) => lang.id === settings.locale) || null}
              onChange={(event, value) =>
                setSettings((prev) => ({ ...prev, locale: value?.id || "" }))
              }
              renderInput={(params) => <TextField {...params} label="Language" />}
            />
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              value={countries.find((c) => c.countryCode === settings.countryCode) || null}
              onChange={handleCountryChange}
              renderInput={(params) => <TextField {...params} label="Country / Region" />}
            />
            <Autocomplete
              options={currencies}
              getOptionLabel={(option) => `${option.name} - ${option.symbol}`}
              groupBy={(option) =>
                popularCurrencies.includes(option.name) ? "Popular currencies" : "Other currencies"
              }
              value={currencies.find((c) => c.name === settings.currency) || null}
              onChange={handleCurrencyChange}
              renderInput={(params) => <TextField {...params} label="Currency" />}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegionalSettings;
