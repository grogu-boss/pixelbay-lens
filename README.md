# Pixelbay Lens v1.0

**Real-time market data overlay for Soulbound's Pixelbay auction house**

![Pixelbay Lens Demo](assets/readme.gif)

A lightweight browser extension that provides instant access to market prices with a sleek, draggable overlay interface. Perfect for players who need quick price information while playing Soulbound.

## Installation

### Chrome/Chromium Browser Installation

#### Manual Installation

1. **Download the Extension**

   - Download the zipped package from https://github.com/grogu-boss/pixelbay-lens/releases/tag/v1.0 
   - Extract the files to a folder (e.g., `pixelbay-lens-extension`)

2. **Enable Developer Mode**

   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle **"Developer mode"** in the top-right corner
   - This enables the "Load unpacked" option

3. **Install the Extension**

   - Click **"Load unpacked"** button
   - Select the folder containing the extension files
   - The extension should appear in your extensions list

4. **Verify Installation**
   - Look for "Pixelbay Lens" in your extensions
   - The extension icon should appear in your browser toolbar
   - Status should show "Enabled"


### Firefox Installation

#### Manual Installation for Firefox

1. **Prepare the Extension**

   - Ensure you have the extension files
   - Note: Firefox may require additional manifest adjustments

2. **Temporary Installation (Development)**

   - Navigate to `about:debugging` in Firefox
   - Click **"This Firefox"** in the sidebar
   - Click **"Load Temporary Add-on"**
   - Select the `manifest.json` file from the extension folder

3. **Permanent Installation**
   - For permanent installation, the extension needs to be signed by Mozilla
   - Contact us for a signed version

### First Time Setup

After installation, the extension is ready to use immediately:

1. **Navigate to Soulbound**

   - Go to `https://play.soulbound.game/`
   - The overlay should appear automatically in the top-right corner

2. **Test the Extension**

   - The overlay should display with "Moon Berry" as the default selected item
   - Try the keyboard shortcut `Ctrl+Shift+M` to toggle visibility
   - Test dragging the overlay to different positions

3. **Troubleshooting First Launch**
   - If overlay doesn't appear, refresh the page
   - Check that the extension is enabled in `chrome://extensions/`
   - Ensure you're on the correct Soulbound domain

## Usage Guide

### Basic Controls

- **Select Items**: Use the dropdown to search and choose from 39+ available items
- **View Prices**: Current gold price displays with percentage changes and analytics
- **Drag to Move**: Click and drag the header to reposition anywhere on screen
- **Minimize/Maximize**: Use the `−`/`+` button to collapse to circular avatar
- **Refresh Data**: Click the `↻` button to update prices manually
- **Close Overlay**: Click the `×` button to hide completely
- **Keyboard Toggle**: Press `Ctrl+Shift+M` anywhere on the page

### Advanced Features

- **Search Functionality**: Type in the item dropdown for instant filtering
- **Position Memory**: Your overlay position is saved between sessions
- **Smart Categories**: Items are organized by type (Seeds, Ores, Crystals, etc.)
- **Price Analytics**: View high/low prices and data point summaries
- **Responsive Design**: Overlay adapts to any screen size or position

## Features

### **Core Functionality**

- **39+ Supported Items** - Complete coverage of seeds, ores, crystals, and materials
- **Real-time Pricing** - Live gold prices with percentage changes
- **Smart Search** - Type-ahead item selection with categorized results
- **Price Analytics** - High/low prices and data point summaries

### **User Experience**

- **Smooth Animations** - Polished minimize/expand transitions
- **Drag & Drop** - Repositionable overlay with position memory
- **Responsive Design** - Clean, modern UI that adapts to any screen position
- **Keyboard Controls** - `Ctrl+Shift+M` global toggle shortcut
- **Minimized Mode** - Compact circular avatar when collapsed

### **Technical Excellence**

- **Performance Optimized** - Minimal resource usage and fast load times
- **Game Integration** - Seamlessly overlays without interfering with gameplay
- **Error Handling** - Graceful fallbacks and user-friendly error messages
- **Memory Efficient** - Smart caching and cleanup to prevent memory leaks

## Items Supported

### Seeds (22 items)

- Zucchini, Sugar Cane, Raspberry, Bell Pepper, Wheat, Coffee
- Spinach, Lettuce, Tea, Wasabi, Soybeans, Cucumber
- Aubergine, Cabbage, Pumpkin, Watermelon, Carrot
- Habanero Chili, Potato, Tomato, Oats, Strawberry

### Ores & Materials (10 items)

- Iron Ore, Copper Ore, Coal, Aluminum Scrap
- Frayed Wires, Bolt, Chronosteel, Sap, Fibre, Amber

### Crystals & Orbs (5 items)

- Obsidian Fragment, Geoterra Crystal, Desert Crystal
- Chronocrystal, Disk Orb

### Other (2 items)

- Flickerfern, Moon Berry

## Privacy & Security

**Your privacy is our top priority. Pixelbay Lens:**

- **NO user tracking** - We don't collect, store, or transmit any personal data
- **NO analytics** - No usage statistics, no behavioral tracking
- **READ-ONLY access** - Only fetches public market data from Soulbound's official API
- **LOCAL processing** - All calculations and data handling happen in your browser
- **NO external servers** - Direct communication with game API only
- **MINIMAL permissions** - Only requests access to Soulbound's domain

**What we access:**

- Public market data from `https://play.soulbound.game/api/economy/amm/price_data`
- Your browser's local storage (for saving overlay position and preferences)

**What we DON'T access:**

- Personal information, account data, or login credentials
- Browsing history or activity on other websites
- Game account details or character information
- Any data transmission to third-party servers

## Technical Details

- **API Endpoint**: `/api/economy/amm/price_data`
- **Data Source**: Official Soulbound game API (read-only)
- **Trading Pairs**: All items paired with gold currency
- **Permissions**: `activeTab`, `storage`, Soulbound domain only
- **Architecture**: Client-side JavaScript with zero external dependencies

## Troubleshooting

### Overlay Not Appearing

- Check if you're on `https://play.soulbound.game/`
- Try refreshing the page
- Use `Ctrl+Shift+M` to manually toggle

### No Price Data

- API parameters may need adjustment based on actual endpoint format
- Check browser console for error messages
- Verify API key and endpoint accessibility

### Performance Issues

- Close overlay when not needed
- Refresh browser tab if charts become unresponsive

## Development

The extension follows a clean architecture:

```
extension/
├── manifest.json      # Extension configuration
├── content.js         # Injection and UI controls
├── overlay.html       # Chart interface structure
├── overlay.css        # Dark theme styling
├── overlay.js         # Chart logic and API calls
└── README.md          # This file
```

## Version 1.0 Release Notes

**Major Improvements:**

- **Perfect alignment** - Fixed all avatar and header positioning issues
- **Smooth animations** - Added bidirectional minimize/expand transitions

## Future Enhancements

- **Auto-refresh** - Configurable real-time price updates
- **Price alerts** - Desktop notifications for target prices
- **Extended data** - Historical charts and trend analysis

---

## 📄 License & Attribution

**Pixelbay Lens v1.0** - Built with ❤️ for the Soulbound gaming community

_This extension is an independent project and is not officially affiliated with Soulbound. All game data belongs to their respective owners._




