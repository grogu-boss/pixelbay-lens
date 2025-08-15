// pixelbay lens - main chart logic
class SoulboundMarketOverlay {
  constructor() {
    this.chart = null;
    this.candlestickSeries = null;
    this.currentItem = "moon berry"; // default item
    this.apiKey = "2f503d20-fdc8-4b90-a37e-8ee14c20938d";
    this.baseUrl = "https://play.soulbound.game/api/economy/amm/price_data";

    // map wiki item names to api pool formats
    // based on working example: poolId=seed_zucchini_to_gold_pool, tradingPair=seed_zucchini/gold

    this.init();
  }

  getPoolMapping(itemName) {
    // convert wiki item names to actual game API format
    // based on actual game calls: poolId="iron_to_gold_pool", tradingPair="objs_AA0010/gold"

    const itemMappings = {
      // seeds - using zucchini example that worked
      "zucchini seed": {
        poolId: "seed_zucchini_to_gold_pool",
        tradingPair: "seed_zucchini/gold",
      },

      // ores/materials - using actual game format
      "iron ore": {
        poolId: "iron_to_gold_pool",
        tradingPair: "objs_AA0010/gold",
      },

      // other items - we'll need to discover their object IDs from game network calls
      // for now, let's try some common patterns
      "copper ore": {
        poolId: "copper_to_gold_pool",
        tradingPair: "copper/gold",
      },
      coal: { poolId: "coal_to_gold_pool", tradingPair: "coal/gold" },

      // add more as we discover the correct object IDs...
    };

    const mapping = itemMappings[itemName];
    if (!mapping) {
      return null;
    }

    const result = { poolId: mapping.poolId, tradingPair: mapping.tradingPair };

    return result;
  }

  init() {
    this.createChart();
    this.setupEventListeners();
    this.loadInitialData();
  }

  createChart() {
    const chartContainer = document.getElementById("chart");
    if (!chartContainer) {
      return;
    }

    // initialize tradingview lightweight charts
    this.chart = LightweightCharts.createChart(chartContainer, {
      width: 400,
      height: 300,
      layout: {
        backgroundColor: "#1a1a1a",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#334155" },
        horzLines: { color: "#334155" },
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#485563",
      },
      timeScale: {
        borderColor: "#485563",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // create candlestick series
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: "#4ade80",
      downColor: "#f87171",
      borderDownColor: "#f87171",
      borderUpColor: "#4ade80",
      wickDownColor: "#f87171",
      wickUpColor: "#4ade80",
    });
  }

  setupEventListeners() {
    const itemSelect = document.getElementById("item-select");
    if (itemSelect) {
      itemSelect.addEventListener("change", (e) => {
        this.currentItem = e.target.value;
        this.loadPriceData();
      });
    }

    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        refreshBtn.classList.add("spinning");
        this.loadPriceData().finally(() => {
          setTimeout(() => refreshBtn.classList.remove("spinning"), 1000);
        });
      });
    }
  }

  async loadInitialData() {
    try {
      await this.loadPriceData();
    } catch (error) {}
  }

  async loadPriceData() {
    try {
      const poolMapping = this.getPoolMapping(this.currentItem);

      if (!poolMapping) {
        return;
      }

      // create date range (last 30 days)
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 30);

      // build api url with correct parameters
      const params = new URLSearchParams({
        poolId: poolMapping.poolId,
        tradingPair: poolMapping.tradingPair,
        from: from.toISOString(),
        to: to.toISOString(),
        granularity: "day",
        format: "candlestick",
      });

      const apiUrl = `${this.baseUrl}?${params}`;

      const response = await fetch(apiUrl, {
        headers: {
          accept: "application/json",
          apikey: this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`api request failed: ${response.status}`);
      }

      const data = await response.json();

      // transform data to tradingview format
      const chartData = this.transformToChartData(data);

      if (chartData && chartData.length > 0) {
        this.candlestickSeries.setData(chartData);
        this.updateCurrentPrice(chartData[chartData.length - 1]);
      } else {
        this.showError("no chart data available for this item");
      }
    } catch (error) {
      this.showError(`failed to load price data: ${error.message}`);
    }
  }

  transformToChartData(apiData) {
    // transform api response to tradingview format
    // api returns candlestick format with createdAt, open, high, low, close

    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    if (apiData.length === 0) {
      return [];
    }

    const transformed = apiData
      .map((item) => ({
        time: Math.floor(new Date(item.createdAt).getTime() / 1000),
        open: parseFloat(item.open || 0),
        high: parseFloat(item.high || 0),
        low: parseFloat(item.low || 0),
        close: parseFloat(item.close || 0),
      }))
      .filter((item) => item.time && !isNaN(item.time)) // filter invalid entries
      .sort((a, b) => a.time - b.time); // sort by time ascending

    return transformed;
  }

  updateCurrentPrice(latestCandle) {
    const priceDisplay = document.getElementById("current-price");
    if (priceDisplay && latestCandle) {
      priceDisplay.textContent = `${latestCandle.close.toFixed(4)} gold`;
    }
  }

  showError(message) {
    const errorDiv = document.getElementById("error-message");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
      setTimeout(() => {
        errorDiv.style.display = "none";
      }, 5000);
    }
  }
}

// attach class to window object for content script access

window.SoulboundMarketOverlay = SoulboundMarketOverlay;

// initialization will be controlled by content script
