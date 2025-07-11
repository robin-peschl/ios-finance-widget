# iOS Finance Widget

A fully customizable [Scriptable](https://scriptable.app) widget for iOS that displays live prices of stocks, ETFs, and cryptocurrencies using data from Yahoo Finance. Supports auto-detected currency symbols, multiple languages, and configurable time ranges for percentage changes.

## ✨ Features

- 📊 Live data for **any asset available on Yahoo Finance**
- 💵 Auto currency symbol detection (€, $, £, etc.)
- 🌍 Multi-language support: English, German, French, Spanish
- 📅 Two optional change columns (e.g. 1-day, 7-day change)
- 🌗 Full support for dark and light mode
- 📱 Optimized for **all widget sizes**, including lock screen widgets
- ⚙️ Simple and clean configuration at the top of the script

## 🛠 Configuration

All configuration is done inside the script file. Example:

```js
// Title of the widget
const WIDGET_TITLE = "Tech & Crypto"

// Language for headers: "EN", "DE", "FR", "ES"
const LANGUAGE = "EN"

// Enable daily and weekly change columns
const ENABLE_CHANGE_COL_1 = true
const RANGE_DAYS_COL_1 = 1
const ENABLE_CHANGE_COL_2 = true
const RANGE_DAYS_COL_2 = 7

// Define the assets to display
const SYMBOLS = [
  { symbol: "AAPL",      label: "Apple" },
  { symbol: "NVDA",      label: "NVIDIA" },
  { symbol: "BTC-USD",   label: "Bitcoin" },
  { symbol: "ETH-USD",   label: "Ethereum" },
  { symbol: "MSFT",      label: "Microsoft" }
]
```

Small and lock screen widgets will only display the first asset in the list.

## 🖼️ Example Images

### 🌓 Medium Size + Dark Mode  
![Medium Widget!](images/ios_finance_widget_medium.jpg)

### 🌞 Large Size + Light Mode  
![Medium Widget!](images/ios_finance_widget_big.jpg)