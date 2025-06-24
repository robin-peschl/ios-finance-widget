// ============================
// == KONFIGURATION / CONFIG ==
// ============================
// Titel des Widgets / Title of the widget
const WIDGET_TITLE = "Tech & Krypto"
// Dark Mode aktivieren / Enable dark mode
const USE_DARK_MODE = true
// Sprache für Spaltenüberschriften / Column header language
// Optionen / Options: "DE", "EN", "FR", "ES"
const LANGUAGE = "DE"
// Spalte 1 aktivieren (z. B. Tagesveränderung) / Enable column 1 (e.g. daily change)
const ENABLE_CHANGE_COL_1 = true
// Zeitraum in Tagen für Spalte 1 / Range in days for column 1
const RANGE_DAYS_COL_1 = 1
// Spalte 2 aktivieren (z. B. Wochenveränderung) / Enable column 2 (e.g. weekly change)
const ENABLE_CHANGE_COL_2 = true
// Zeitraum in Tagen für Spalte 2 / Range in days for column 2
const RANGE_DAYS_COL_2 = 7
// Liste der Assets / List of assets
// BTC & MATIC in EUR to demonstrate auto currency detection
const SYMBOLS = [
  { symbol: "NVDA",      label: "NVIDIA" },
  { symbol: "AAPL",      label: "Apple" },
  { symbol: "MSFT",      label: "Microsoft" },
  { symbol: "BTC-EUR",   label: "Bitcoin" },
  { symbol: "MATIC-EUR", label: "Matic" }
]
// ============================
// == SCRIPTABLE WIDGET CODE ==
// ============================
// Return localized column headers
function getColumnLabels(lang) {
  switch (lang) {
    case "DE": return { label1: "Bezeichnung", label2: "Preis" }
    case "FR": return { label1: "Actif",       label2: "Prix" }
    case "ES": return { label1: "Activo",      label2: "Precio" }
    default:   return { label1: "Asset",       label2: "Price" }
  }
}
// Convert currency code to a readable symbol
function currencySymbol(code) {
  const map = {
    USD: "$", EUR: "€", GBP: "£", CHF: "Fr.",
    JPY: "¥", AUD: "A$", CAD: "C$", INR: "₹"
  }
  return map[code] || code
}
// Fetch data for a single asset from Yahoo Finance
async function fetchSymbolData(symbol) {
  const maxRange = Math.max(RANGE_DAYS_COL_1, RANGE_DAYS_COL_2)
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${maxRange + 1}d`
  try {
    const data = await new Request(url).loadJSON()
    const result = data.chart.result[0]
    const close = result.indicators.quote[0].close
    const current = result.meta.regularMarketPrice
    const currency = currencySymbol(result.meta.currency)
    const change = (days) => {
      if (close.length <= days) return null
      const past = close[close.length - 1 - days]
      return past ? ((current - past) / past) * 100 : null
    }
    return {
      price: current,
      currency,
      change1: ENABLE_CHANGE_COL_1 ? change(RANGE_DAYS_COL_1) : null,
      change2: ENABLE_CHANGE_COL_2 ? change(RANGE_DAYS_COL_2) : null
    }
  } catch (e) {
    console.error(`Error fetching ${symbol}:`, e)
    return null
  }
}
// Format a percentage change with up/down arrow
function formatChange(val) {
  if (val === null) return "-"
  const arrow = val >= 0 ? "↑" : "↓"
  return `${arrow} ${Math.abs(val).toFixed(2)}%`
}
// Return color depending on value direction
function getColor(val, gray) {
  if (val === null) return gray
  return val >= 0 ? Color.green() : Color.red()
}
// Define fixed layout width (medium and large share same width)
function getAdjustedWidgetWidth() {
  switch (config.widgetFamily) {
    case "small":
      return 150
    case "medium":
    case "large":
    default:
      return 300 // consistent layout width
  }
}
// Create and return the widget
async function createWidget() {
  const BG = USE_DARK_MODE ? new Color("#1C1C1E") : Color.white()
  const TEXT = USE_DARK_MODE ? Color.white() : Color.black()
  const GRAY = USE_DARK_MODE ? Color.gray() : new Color("#444")
  const HEADER = TEXT
  const { label1, label2 } = getColumnLabels(LANGUAGE)
  const widget = new ListWidget()
  widget.setPadding(12, 15, 12, 15)
  widget.backgroundColor = BG
  // Header with title and icon
  const titleStack = widget.addStack()
  titleStack.centerAlignContent()
  const icon = SFSymbol.named("chart.bar.fill")
  const iconImg = titleStack.addImage(icon.image)
  iconImg.imageSize = new Size(16, 16)
  iconImg.tintColor = TEXT
  titleStack.addSpacer(6)
  const title = titleStack.addText(WIDGET_TITLE)
  title.textColor = TEXT
  title.font = Font.boldSystemFont(14)
  widget.addSpacer(8)
  // Handle small and lock-screen widgets with a simplified layout
  const isAccessory = config.widgetFamily?.startsWith("accessory")
  if (config.widgetFamily === "small" || isAccessory) {
    const asset = SYMBOLS[0]
    const data = await fetchSymbolData(asset.symbol)
    if (data) {
      const label = widget.addText(asset.label)
      label.textColor = TEXT
      label.font = Font.boldSystemFont(isAccessory ? 12 : 14)
      widget.addSpacer(2)
      const price = widget.addText(`${data.price.toFixed(2)} ${data.currency}`)
      price.textColor = TEXT
      price.font = Font.systemFont(isAccessory ? 10 : 12)
      if (ENABLE_CHANGE_COL_1 && data.change1 !== null) {
        widget.addSpacer(1)
        const c1 = widget.addText(formatChange(data.change1))
        c1.textColor = getColor(data.change1, GRAY)
        c1.font = Font.systemFont(isAccessory ? 9 : 11)
      }
    }
    return widget
  }
  // Fetch and prepare price data
  const prices = []
  for (const asset of SYMBOLS) {
    const data = await fetchSymbolData(asset.symbol)
    if (!data) continue
    prices.push({
      label: asset.label,
      price: `${data.price.toFixed(2)} ${data.currency}`,
      change1: data.change1,
      change2: data.change2
    })
  }
  // Build column data
  const col1 = [label1, ...prices.map(p => p.label)]
  const col2 = [label2, ...prices.map(p => p.price)]
  const col3 = ENABLE_CHANGE_COL_1 ? [`${RANGE_DAYS_COL_1}D`, ...prices.map(p => formatChange(p.change1))] : []
  const col4 = ENABLE_CHANGE_COL_2 ? [`${RANGE_DAYS_COL_2}D`, ...prices.map(p => formatChange(p.change2))] : []
  const colors3 = ENABLE_CHANGE_COL_1 ? [HEADER, ...prices.map(p => getColor(p.change1, GRAY))] : []
  const colors4 = ENABLE_CHANGE_COL_2 ? [HEADER, ...prices.map(p => getColor(p.change2, GRAY))] : []
  const columns = [col1, col2]
  const colorSets = [[], []]
  if (ENABLE_CHANGE_COL_1) { columns.push(col3); colorSets.push(colors3) }
  if (ENABLE_CHANGE_COL_2) { columns.push(col4); colorSets.push(colors4) }
  // Calculate spacing dynamically
  const colWidth = 70
  const available = getAdjustedWidgetWidth()
  const spacing = Math.max(4, Math.floor((available - (colWidth * columns.length)) / (columns.length - 1)))
  // Render the main table
  const rowStack = widget.addStack()
  rowStack.layoutHorizontally()
  rowStack.spacing = spacing
  for (let i = 0; i < columns.length; i++) {
    const colStack = rowStack.addStack()
    colStack.layoutVertically()
    colStack.spacing = 4
    colStack.size = new Size(colWidth, 0)
    for (let j = 0; j < columns[i].length; j++) {
      const txt = colStack.addText(columns[i][j])
      txt.font = j === 0 ? Font.mediumSystemFont(12) : Font.systemFont(12)
      txt.textColor = colorSets[i]?.[j] || (j === 0 ? HEADER : GRAY)
      txt.leftAlignText()
      txt.minimumScaleFactor = 0.7
      txt.lineLimit = 1
    }
  }
  widget.addSpacer()
  // Footer row with time and petuja.net
  const footerStack = widget.addStack()
  footerStack.layoutHorizontally()
  const now = new Date()
  const time = footerStack.addText(now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }))
  time.font = Font.systemFont(10)
  time.textColor = GRAY
  time.leftAlignText()
  footerStack.addSpacer()
  const site = footerStack.addText("petuja.net")
  site.font = Font.systemFont(10)
  site.textColor = GRAY
  site.rightAlignText()
  return widget
}
// Run widget
if (config.runsInWidget) {
  const w = await createWidget()
  Script.setWidget(w)
} else {
  const w = await createWidget()
  await w.presentMedium()
}
Script.complete()
