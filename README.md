# Petuja Finance Widget

A fully customizable Scriptable widget for iOS that displays live prices for selected stocks and cryptocurrencies. The widget supports automatic currency symbol detection, multi-language column headers, and configurable change indicators over custom time ranges (e.g., daily and weekly). 

## Features

- 📈 Live price tracking via Yahoo Finance API
- 💹 Supports both stocks and cryptocurrencies
- 🔄 Auto currency detection (€, $, £, etc.)
- 🌐 Multi-language support: DE, EN, FR, ES
- 🧮 Configurable change columns (e.g. 1-day, 7-day)
- 🎨 Light and dark mode support
- 📱 Optimized for medium and large iOS widgets
- 🧰 Minimal setup, clean layout, open-source

## Example Assets

```js
const SYMBOLS = [
  { symbol: "NVDA",      label: "NVIDIA" },
  { symbol: "AAPL",      label: "Apple" },
  { symbol: "MSFT",      label: "Microsoft" },
  { symbol: "BTC-EUR",   label: "Bitcoin" },
  { symbol: "MATIC-EUR", label: "Matic" }
]
