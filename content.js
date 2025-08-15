(function () {
  "use strict";

  if (window.soulboundOverlayInjected) {
    return;
  }
  window.soulboundOverlayInjected = true;

  document.addEventListener(
    "mousemove",
    (e) => {
      lastMousePosition.x = e.clientX;
      lastMousePosition.y = e.clientY;
    },
    true
  );

  let overlayContainer = null;
  let isOverlayVisible = false;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let marketOverlay = null;
  let dragPollingInterval = null;
  let lastMousePosition = { x: 0, y: 0 };
  let finalDragPosition = null;
  let hasDragged = false;
  // thresholds to distinguish click vs drag intent
  let dragStartTime = 0;
  let dragStartPosition = { x: 0, y: 0 };
  const CLICK_THRESHOLD_MS = 200;
  const MOVE_THRESHOLD_PX = 5;

  // tradingview library integration removed to keep the extension lightweight

  // initialize market overlay directly in content script (avoid context isolation)
  async function initializeMarketOverlay() {
    // no external chart library needed; proceed to create overlay

    marketOverlay = {
      chart: null,
      candlestickSeries: null,
      currentItem: "moon berry",
      apiKey: "2f503d20-fdc8-4b90-a37e-8ee14c20938d",
      baseUrl: "https://play.soulbound.game/api/economy/amm/price_data",

      getPoolMapping(itemName) {
        const itemMappings = {
          // seeds
          "zucchini seed": {
            poolId: "seed_zucchini_to_gold_pool",
            tradingPair: "seed_zucchini/gold",
          },
          "strawberry seed": {
            poolId: "seed_strawberry_to_gold_pool",
            tradingPair: "seed_strawberry/gold",
          },
          "oats seed": {
            poolId: "seed_oats_to_gold_pool",
            tradingPair: "seed_oats/gold",
          },
          "tomato seed": {
            poolId: "seed_tomato_to_gold_pool",
            tradingPair: "seed_tomato/gold",
          },
          "aubergine seed": {
            poolId: "seed_aubergine_to_gold_pool",
            tradingPair: "seed_aubergine/gold",
          },
          "potato seed": {
            poolId: "seed_potato_to_gold_pool",
            tradingPair: "seed_potato/gold",
          },
          "habanero chili seed": {
            poolId: "seed_habanero_chili_to_gold_pool",
            tradingPair: "seed_habanero_chili/gold",
          },
          "carrot seed": {
            poolId: "seed_carrot_to_gold_pool",
            tradingPair: "seed_carrot/gold",
          },
          "watermelon seed": {
            poolId: "seed_watermelon_to_gold_pool",
            tradingPair: "seed_watermelon/gold",
          },
          "pumpkin seed": {
            poolId: "seed_pumpkin_to_gold_pool",
            tradingPair: "seed_pumpkin/gold",
          },
          "cabbage seed": {
            poolId: "seed_cabbage_to_gold_pool",
            tradingPair: "seed_cabbage/gold",
          },
          "cucumber seed": {
            poolId: "seed_cucumber_to_gold_pool",
            tradingPair: "seed_cucumber/gold",
          },
          "soybeans seed": {
            poolId: "seed_soybeans_to_gold_pool",
            tradingPair: "seed_soybeans/gold",
          },
          "wasabi seed": {
            poolId: "seed_wasabi_to_gold_pool",
            tradingPair: "seed_wasabi/gold",
          },
          "tea seed": {
            poolId: "seed_tea_to_gold_pool",
            tradingPair: "seed_tea/gold",
          },
          "lettuce seed": {
            poolId: "seed_lettuce_to_gold_pool",
            tradingPair: "seed_lettuce/gold",
          },
          "spinach seed": {
            poolId: "seed_spinach_to_gold_pool",
            tradingPair: "seed_spinach/gold",
          },
          "coffee seed": {
            poolId: "seed_coffee_beans_to_gold_pool",
            tradingPair: "seed_coffee_beans/gold",
          },
          "wheat seed": {
            poolId: "seed_wheat_to_gold_pool",
            tradingPair: "seed_wheat/gold",
          },
          "bell pepper seed": {
            poolId: "seed_bell_pepper_to_gold_pool",
            tradingPair: "seed_bell_pepper/gold",
          },
          "raspberry seed": {
            poolId: "seed_raspberry_to_gold_pool",
            tradingPair: "seed_raspberry/gold",
          },
          "sugar cane seed": {
            poolId: "seed_sugar_cane_to_gold_pool",
            tradingPair: "seed_sugar_cane/gold",
          },

          // ores & materials - using actual game API mappings
          "iron ore": {
            poolId: "iron_to_gold_pool",
            tradingPair: "objs_AA0010/gold",
          },
          "copper ore": {
            poolId: "copper_ore_to_gold_pool",
            tradingPair: "objs_AA0011/gold",
          },
          coal: {
            poolId: "coal_to_gold_pool",
            tradingPair: "objs_AA0009/gold",
          },
          "frayed wires": {
            poolId: "objs_AA0003_to_gold_pool",
            tradingPair: "objs_AA0003/gold",
          },
          amber: {
            poolId: "objs_AA0035_to_gold_pool",
            tradingPair: "objs_AA0035/gold",
          },
          chronosteel: {
            poolId: "chronosteel_to_gold_pool",
            tradingPair: "objs_AB0005/gold",
          },
          sap: {
            poolId: "objs_AA0041_to_gold_pool",
            tradingPair: "objs_AA0041/gold",
          },
          "aluminum scrap": {
            poolId: "objs_AA0004_to_gold_pool",
            tradingPair: "objs_AA0004/gold",
          },
          bolt: {
            poolId: "objs_AA0002_to_gold_pool",
            tradingPair: "objs_AA0002/gold",
          },
          fibre: {
            poolId: "fibre_to_gold_pool",
            tradingPair: "objs_AA0001/gold",
          },
          "obsidian fragment": {
            poolId: "obsidian_fragment_to_gold",
            tradingPair: "objs_AA0014/gold",
          },

          // crystals
          "desert crystal": {
            poolId: "objs_AA0028_to_gold_pool",
            tradingPair: "objs_AA0028/gold",
          },
          chronocrystal: {
            poolId: "objs_AA0013_to_gold_pool",
            tradingPair: "objs_AA0013/gold",
          },
          "geoterra crystal": {
            poolId: "terracore_to_gold_pool",
            tradingPair: "objs_AA0012/gold",
          },

          // other
          flickerfern: {
            poolId: "objs_AA0042_to_gold_pool",
            tradingPair: "objs_AA0042/gold",
          },
          "moon berry": {
            poolId: "objs_AA0043_to_gold_pool",
            tradingPair: "objs_AA0043/gold",
          },
          "disk orb": {
            poolId: "diskorbs_to_gold_pool",
            tradingPair: "curr_AZ0003/gold",
          },
        };

        const mapping = itemMappings[itemName];
        if (!mapping) {
          return null;
        }

        return mapping;
      },

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
            // update the comprehensive price display (no chart)
            this.updateCurrentPrice(chartData[chartData.length - 1], chartData);
          } else {
            this.showError("no price data available for this item");
          }
        } catch (error) {
          this.showError(`failed to load price data: ${error.message}`);
        }
      },

      transformToChartData(apiData) {
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
          .filter((item) => item.time && !isNaN(item.time))
          .sort((a, b) => a.time - b.time);

        return transformed;
      },

      updateCurrentPrice(latestCandle, allData) {
        const priceDisplay = overlayContainer.querySelector("#current-price");
        const priceChange = overlayContainer.querySelector("#price-change");
        const priceChangeValue = overlayContainer.querySelector(
          "#price-change-value"
        );
        const priceDetails = overlayContainer.querySelector("#price-details");
        const priceHigh = overlayContainer.querySelector("#price-high");
        const priceLow = overlayContainer.querySelector("#price-low");
        const priceMeta = overlayContainer.querySelector("#price-meta");
        const summaryLine = overlayContainer.querySelector("#summary-line");

        if (priceDisplay && latestCandle) {
          // update main price
          priceDisplay.textContent = `${latestCandle.close.toFixed(4)} gold`;

          // calculate price change if we have multiple data points
          if (allData && allData.length > 1) {
            const previous = allData[allData.length - 2];
            const change = latestCandle.close - previous.close;
            const changePercent =
              previous.close > 0 ? (change / previous.close) * 100 : 0;

            // update price change
            const changeSymbol = change >= 0 ? "↗" : "↘";
            const changeText = `${changeSymbol} ${change.toFixed(
              4
            )} (${changePercent.toFixed(2)}%)`;

            if (priceChangeValue) {
              priceChangeValue.textContent = changeText;
              priceChangeValue.className = `price-change-value ${
                change >= 0 ? "positive" : "negative"
              }`;
            }
            if (priceChange) {
              priceChange.style.display = "block";
            }
          }

          // update high/low for the latest period
          if (priceHigh) {
            priceHigh.textContent = `${latestCandle.high.toFixed(4)}`;
          }
          if (priceLow) {
            priceLow.textContent = `${latestCandle.low.toFixed(4)}`;
          }
          if (priceDetails) {
            priceDetails.style.display = "flex";
          }

          // update metadata summary for clarity over raw counts
          if (allData && allData.length > 0) {
            const count = allData.length;
            const first = allData[0];
            const last = allData[allData.length - 1];
            const firstDate = new Date(first.time * 1000);
            const lastDate = new Date(last.time * 1000);
            const firstStr = firstDate.toLocaleDateString();
            const lastStr = lastDate.toLocaleDateString();

            // if last date is today, render "present"
            const today = new Date();
            const isSameDay =
              lastDate.getFullYear() === today.getFullYear() &&
              lastDate.getMonth() === today.getMonth() &&
              lastDate.getDate() === today.getDate();
            const endLabel = isSameDay ? "present" : lastStr;

            if (summaryLine) {
              summaryLine.textContent = `Based on last ${count} data points from ${firstStr} to ${endLabel}`;
            }
            if (priceMeta) {
              priceMeta.style.display = "flex";
            }
          }
        }
      },

      showError(message) {
        const errorDiv = overlayContainer.querySelector("#error-message");
        if (errorDiv) {
          errorDiv.textContent = message;
          errorDiv.style.display = "block";
          setTimeout(() => {
            errorDiv.style.display = "none";
          }, 5000);
        }
      },

      init() {
        this.setupEventListeners();
        this.loadInitialData();
      },

      setupEventListeners() {
        this.setupSearchFunctionality();

        const refreshBtn = overlayContainer.querySelector("#refresh-btn");
        if (refreshBtn) {
          refreshBtn.addEventListener("click", () => {
            refreshBtn.classList.add("spinning");
            this.loadPriceData().finally(() => {
              setTimeout(() => refreshBtn.classList.remove("spinning"), 1000);
            });
          });
        }
      },

      setupSearchFunctionality() {
        const searchInput = overlayContainer.querySelector("#item-search");
        const searchDropdown =
          overlayContainer.querySelector("#search-dropdown");

        if (!searchInput || !searchDropdown) return;

        // build items list from mappings
        this.buildItemsList();

        // set default item if none selected
        if (!this.currentItem && this.allItems.length > 0) {
          this.currentItem = "moon berry"; // default to moon berry
        }

        // always update the search input and selection indicator to show current selection
        if (this.currentItem) {
          searchInput.value = this.formatItemName(this.currentItem);
          const currentSelection =
            overlayContainer.querySelector("#current-selection");
          if (currentSelection) {
            currentSelection.textContent = this.formatItemName(
              this.currentItem
            );
          }
        }

        // ensure search input can receive focus and events
        searchInput.tabIndex = 0;
        searchInput.style.pointerEvents = "auto";
        searchInput.style.zIndex = "999999";

        // search input events with proper event capture
        searchInput.addEventListener(
          "input",
          (e) => {
            const query = e.target.value.toLowerCase().trim();
            this.filterAndShowItems(query);
            e.stopPropagation();
          },
          true
        );

        searchInput.addEventListener(
          "focus",
          (e) => {
            this.filterAndShowItems(searchInput.value.toLowerCase().trim());
            e.stopPropagation();
          },
          true
        );

        searchInput.addEventListener(
          "click",
          (e) => {
            e.stopPropagation();
            e.preventDefault();
            searchInput.focus();
          },
          true
        );

        // additional keyboard event handling
        searchInput.addEventListener(
          "keydown",
          (e) => {
            // don't let arrow keys bubble up to avoid game control
            if (
              e.key === "ArrowUp" ||
              e.key === "ArrowDown" ||
              e.key === "Enter" ||
              e.key === "Escape"
            ) {
              this.handleKeyboardNavigation(e);
            } else {
              e.stopPropagation();
            }
          },
          true
        );

        searchInput.addEventListener(
          "keyup",
          (e) => {
            e.stopPropagation();
          },
          true
        );

        // hide dropdown when clicking outside
        document.addEventListener(
          "click",
          (e) => {
            if (
              !searchInput.contains(e.target) &&
              !searchDropdown.contains(e.target)
            ) {
              // hide dropdown and blur input so focus returns to the game
              searchDropdown.style.display = "none";
              if (document.activeElement === searchInput) {
                searchInput.blur();
              }
            }
          },
          true
        );
      },

      buildItemsList() {
        const itemMappings = this.getAllItemMappings();
        this.allItems = [];

        // categorize items
        const categories = {
          Seeds: [],
          "Ores & Materials": [],
          Crystals: [],
          Other: [],
        };

        for (const [itemKey, mapping] of Object.entries(itemMappings)) {
          const item = {
            key: itemKey,
            displayName: this.formatItemName(itemKey),
            category: this.categorizeItem(itemKey),
          };

          categories[item.category].push(item);
          this.allItems.push(item);
        }

        this.itemCategories = categories;
      },

      getAllItemMappings() {
        // extract from the existing getPoolMapping method
        const itemMappings = {
          // seeds
          "zucchini seed": {
            poolId: "seed_zucchini_to_gold_pool",
            tradingPair: "seed_zucchini/gold",
          },
          "strawberry seed": {
            poolId: "seed_strawberry_to_gold_pool",
            tradingPair: "seed_strawberry/gold",
          },
          "oats seed": {
            poolId: "seed_oats_to_gold_pool",
            tradingPair: "seed_oats/gold",
          },
          "tomato seed": {
            poolId: "seed_tomato_to_gold_pool",
            tradingPair: "seed_tomato/gold",
          },
          "aubergine seed": {
            poolId: "seed_aubergine_to_gold_pool",
            tradingPair: "seed_aubergine/gold",
          },
          "potato seed": {
            poolId: "seed_potato_to_gold_pool",
            tradingPair: "seed_potato/gold",
          },
          "habanero chili seed": {
            poolId: "seed_habanero_chili_to_gold_pool",
            tradingPair: "seed_habanero_chili/gold",
          },
          "carrot seed": {
            poolId: "seed_carrot_to_gold_pool",
            tradingPair: "seed_carrot/gold",
          },
          "watermelon seed": {
            poolId: "seed_watermelon_to_gold_pool",
            tradingPair: "seed_watermelon/gold",
          },
          "pumpkin seed": {
            poolId: "seed_pumpkin_to_gold_pool",
            tradingPair: "seed_pumpkin/gold",
          },
          "cabbage seed": {
            poolId: "seed_cabbage_to_gold_pool",
            tradingPair: "seed_cabbage/gold",
          },
          "cucumber seed": {
            poolId: "seed_cucumber_to_gold_pool",
            tradingPair: "seed_cucumber/gold",
          },
          "soybeans seed": {
            poolId: "seed_soybeans_to_gold_pool",
            tradingPair: "seed_soybeans/gold",
          },
          "wasabi seed": {
            poolId: "seed_wasabi_to_gold_pool",
            tradingPair: "seed_wasabi/gold",
          },
          "tea seed": {
            poolId: "seed_tea_to_gold_pool",
            tradingPair: "seed_tea/gold",
          },
          "lettuce seed": {
            poolId: "seed_lettuce_to_gold_pool",
            tradingPair: "seed_lettuce/gold",
          },
          "spinach seed": {
            poolId: "seed_spinach_to_gold_pool",
            tradingPair: "seed_spinach/gold",
          },
          "coffee seed": {
            poolId: "seed_coffee_beans_to_gold_pool",
            tradingPair: "seed_coffee_beans/gold",
          },
          "wheat seed": {
            poolId: "seed_wheat_to_gold_pool",
            tradingPair: "seed_wheat/gold",
          },
          "bell pepper seed": {
            poolId: "seed_bell_pepper_to_gold_pool",
            tradingPair: "seed_bell_pepper/gold",
          },
          "raspberry seed": {
            poolId: "seed_raspberry_to_gold_pool",
            tradingPair: "seed_raspberry/gold",
          },
          "sugar cane seed": {
            poolId: "seed_sugar_cane_to_gold_pool",
            tradingPair: "seed_sugar_cane/gold",
          },

          // ores & materials - using actual game API mappings
          "iron ore": {
            poolId: "iron_to_gold_pool",
            tradingPair: "objs_AA0010/gold",
          },
          "copper ore": {
            poolId: "copper_ore_to_gold_pool",
            tradingPair: "objs_AA0011/gold",
          },
          coal: {
            poolId: "coal_to_gold_pool",
            tradingPair: "objs_AA0009/gold",
          },
          "frayed wires": {
            poolId: "objs_AA0003_to_gold_pool",
            tradingPair: "objs_AA0003/gold",
          },
          amber: {
            poolId: "objs_AA0035_to_gold_pool",
            tradingPair: "objs_AA0035/gold",
          },
          chronosteel: {
            poolId: "chronosteel_to_gold_pool",
            tradingPair: "objs_AB0005/gold",
          },
          sap: {
            poolId: "objs_AA0041_to_gold_pool",
            tradingPair: "objs_AA0041/gold",
          },
          "aluminum scrap": {
            poolId: "objs_AA0004_to_gold_pool",
            tradingPair: "objs_AA0004/gold",
          },
          bolt: {
            poolId: "objs_AA0002_to_gold_pool",
            tradingPair: "objs_AA0002/gold",
          },
          fibre: {
            poolId: "fibre_to_gold_pool",
            tradingPair: "objs_AA0001/gold",
          },
          "obsidian fragment": {
            poolId: "obsidian_fragment_to_gold",
            tradingPair: "objs_AA0014/gold",
          },

          // crystals
          "desert crystal": {
            poolId: "objs_AA0028_to_gold_pool",
            tradingPair: "objs_AA0028/gold",
          },
          chronocrystal: {
            poolId: "objs_AA0013_to_gold_pool",
            tradingPair: "objs_AA0013/gold",
          },
          "geoterra crystal": {
            poolId: "terracore_to_gold_pool",
            tradingPair: "objs_AA0012/gold",
          },

          // other
          flickerfern: {
            poolId: "objs_AA0042_to_gold_pool",
            tradingPair: "objs_AA0042/gold",
          },
          "moon berry": {
            poolId: "objs_AA0043_to_gold_pool",
            tradingPair: "objs_AA0043/gold",
          },
          "disk orb": {
            poolId: "diskorbs_to_gold_pool",
            tradingPair: "curr_AZ0003/gold",
          },
        };

        return itemMappings;
      },

      categorizeItem(itemKey) {
        if (itemKey.includes("seed")) return "Seeds";
        if (
          ["desert crystal", "chronocrystal", "geoterra crystal"].includes(
            itemKey
          )
        )
          return "Crystals";
        if (
          [
            "iron ore",
            "copper ore",
            "coal",
            "frayed wires",
            "amber",
            "chronosteel",
            "sap",
            "aluminum scrap",
            "bolt",
            "fibre",
            "obsidian fragment",
          ].includes(itemKey)
        )
          return "Ores & Materials";
        return "Other";
      },

      formatItemName(itemKey) {
        const base = itemKey
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        // display pluralized label for moon berry for clarity
        if (itemKey === "moon berry" || itemKey === "moon berries") {
          return "Moon Berries";
        }
        return base;
      },

      filterAndShowItems(query) {
        const searchDropdown =
          overlayContainer.querySelector("#search-dropdown");
        if (!searchDropdown) return;

        if (query === "") {
          searchDropdown.style.display = "none";
          return;
        }

        const filteredItems = this.allItems.filter(
          (item) =>
            item.displayName.toLowerCase().includes(query) ||
            item.key.toLowerCase().includes(query)
        );

        this.renderSearchDropdown(filteredItems);
        searchDropdown.style.display =
          filteredItems.length > 0 ? "block" : "none";
      },

      renderSearchDropdown(filteredItems) {
        const searchDropdown =
          overlayContainer.querySelector("#search-dropdown");
        if (!searchDropdown) return;

        // group by category
        const groupedItems = {};
        filteredItems.forEach((item) => {
          if (!groupedItems[item.category]) {
            groupedItems[item.category] = [];
          }
          groupedItems[item.category].push(item);
        });

        let html = "";
        for (const [category, items] of Object.entries(groupedItems)) {
          if (items.length > 0) {
            html += `<div class="search-dropdown-category">${category}</div>`;
            items.forEach((item) => {
              html += `<div class="search-dropdown-item" data-item-key="${item.key}">${item.displayName}</div>`;
            });
          }
        }

        searchDropdown.innerHTML = html;

        // add click handlers
        searchDropdown
          .querySelectorAll(".search-dropdown-item")
          .forEach((item) => {
            item.addEventListener("click", () => {
              this.selectItem(item.dataset.itemKey);
            });
          });
      },

      selectItem(itemKey) {
        const searchInput = overlayContainer.querySelector("#item-search");
        const searchDropdown =
          overlayContainer.querySelector("#search-dropdown");
        const currentSelection =
          overlayContainer.querySelector("#current-selection");

        if (searchInput) {
          searchInput.value = this.formatItemName(itemKey);
        }
        if (searchDropdown) {
          searchDropdown.style.display = "none";
        }
        if (currentSelection) {
          currentSelection.textContent = this.formatItemName(itemKey);
        }

        this.currentItem = itemKey;
        this.loadPriceData();
      },

      handleKeyboardNavigation(e) {
        const searchDropdown =
          overlayContainer.querySelector("#search-dropdown");
        if (!searchDropdown || searchDropdown.style.display === "none") return;

        const items = searchDropdown.querySelectorAll(".search-dropdown-item");
        const currentSelected = searchDropdown.querySelector(
          ".search-dropdown-item.selected"
        );

        let selectedIndex = -1;
        if (currentSelected) {
          selectedIndex = Array.from(items).indexOf(currentSelected);
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();
          selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();
          selectedIndex = Math.max(selectedIndex - 1, 0);
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          if (selectedIndex >= 0 && items[selectedIndex]) {
            this.selectItem(items[selectedIndex].dataset.itemKey);
            return;
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          searchDropdown.style.display = "none";
          return;
        }

        // update selection
        items.forEach((item, index) => {
          item.classList.toggle("selected", index === selectedIndex);
        });
      },

      async loadInitialData() {
        try {
          await this.loadPriceData();
        } catch (error) {
          console.error("loadInitialData() failed:", error);
        }
      },
    };

    // initialize the market overlay
    marketOverlay.init();

    // set avatar sources for both minimized and header views using extension-safe urls
    try {
      const avatarUrl = chrome.runtime.getURL("assets/avatar.png");
      const headerAvatar = overlayContainer.querySelector(".header-avatar");
      const minAvatar = overlayContainer.querySelector(".min-avatar");
      if (headerAvatar) headerAvatar.src = avatarUrl;
      if (minAvatar) minAvatar.src = avatarUrl;
    } catch (e) {
      console.warn("unable to set avatar image", e);
    }
  }

  // inject overlay into page
  function injectOverlay() {
    if (overlayContainer) {
      return; // already injected
    }

    // create iframe container for isolated styling
    overlayContainer = document.createElement("div");
    overlayContainer.id = "soulbound-market-container";
    overlayContainer.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            user-select: none !important;
        `;

    // load overlay html content
    fetch(chrome.runtime.getURL("overlay.html"))
      .then((response) => response.text())
      .then((html) => {
        overlayContainer.innerHTML = html;
        document.body.appendChild(overlayContainer);

        // initialize the market overlay directly (avoid context isolation issues)
        initializeMarketOverlay()
          .then(() => {
            // set up overlay functionality after market overlay is ready
            setupOverlayControls();
            setupDragAndDrop();

            isOverlayVisible = true;
          })
          .catch((error) => {
            console.error("failed to initialize market overlay:", error);
          });
      })
      .catch((error) => {
        console.error("failed to load overlay:", error);
      });
  }

  // set up overlay control buttons
  function setupOverlayControls() {
    const toggleBtn = overlayContainer.querySelector("#toggle-btn");
    const closeBtn = overlayContainer.querySelector("#close-btn");
    const overlayContent = overlayContainer.querySelector("#overlay-content");
    const overlay = overlayContainer.querySelector("#soulbound-overlay");

    if (toggleBtn && overlayContent && overlay) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isMinimized = overlay.classList.contains("minimized");
        if (isMinimized) {
          overlay.classList.remove("minimized");
          overlay.classList.remove("dragged"); // remove dragged class when expanding
          overlay.classList.remove("being-dragged"); // remove being-dragged class when expanding
          toggleBtn.textContent = "−";
          toggleBtn.title = "minimize";
        } else {
          overlay.classList.add("minimized");
          overlay.classList.remove("dragged"); // reset to default position when minimizing
          overlay.classList.remove("being-dragged"); // reset being-dragged when minimizing
          toggleBtn.textContent = "+";
          toggleBtn.title = "maximize";
        }
      });
    }

    // allow clicking anywhere on the minimized overlay to restore it
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        const isMinimized = overlay.classList.contains("minimized");
        // only handle clicks when minimized, not on buttons, not during drag, and no actual dragging occurred
        if (
          isMinimized &&
          e.target.tagName !== "BUTTON" &&
          !isDragging &&
          !hasDragged
        ) {
          // restore the overlay when clicking on the minimized circle
          overlay.classList.remove("minimized");
          overlay.classList.remove("dragged"); // remove dragged class when expanding
          overlay.classList.remove("being-dragged"); // remove being-dragged class when expanding
          if (toggleBtn) {
            toggleBtn.textContent = "−";
            toggleBtn.title = "minimize";
          }
          e.stopPropagation();
          e.preventDefault();
        } else if (isMinimized && hasDragged) {
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        hideOverlay();
      });
    }
  }

  // enable drag and drop functionality
  function setupDragAndDrop() {
    const header = overlayContainer.querySelector(".overlay-header");
    const overlay = overlayContainer.querySelector("#soulbound-overlay");

    if (!header || !overlay) return;

    // ensure proper cursor is set initially and pointer events work
    header.style.cursor = "move";
    header.style.pointerEvents = "auto";

    // polling-based drag system to bypass game event interference
    function startDrag(e) {
      // don't drag when clicking buttons
      if (e.target.tagName === "BUTTON") return;

      isDragging = true;
      hasDragged = false; // reset drag flag
      dragStartTime = Date.now();
      dragStartPosition.x = e.clientX;
      dragStartPosition.y = e.clientY;
      // seed last mouse position to the event to avoid initial snap
      lastMousePosition.x = e.clientX;
      lastMousePosition.y = e.clientY;
      const rect = overlayContainer.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;

      // defer visual drag state until user intention is clear (prevents accidental snap)

      overlay.style.userSelect = "none";
      document.body.style.userSelect = "none";

      // start polling for mouse position updates
      startDragPolling();

      e.stopImmediatePropagation();
      e.preventDefault();
    }

    function startDragPolling() {
      if (dragPollingInterval) {
        clearInterval(dragPollingInterval);
      }

      dragPollingInterval = setInterval(() => {
        if (!isDragging) {
          clearInterval(dragPollingInterval);
          dragPollingInterval = null;
          return;
        }

        updateDragPosition();
      }, 16); // ~60fps for smooth dragging
    }

    function updateDragPosition() {
      const dx = lastMousePosition.x - dragStartPosition.x;
      const dy = lastMousePosition.y - dragStartPosition.y;
      const dist = Math.hypot(dx, dy);
      const heldMs = Date.now() - dragStartTime;

      // determine if user intends to drag
      const intendsToDrag =
        dist > MOVE_THRESHOLD_PX || heldMs > CLICK_THRESHOLD_MS;

      if (!hasDragged && intendsToDrag) {
        hasDragged = true;
        const isMinimized = overlay.classList.contains("minimized");
        if (isMinimized) {
          overlay.style.cursor = "grabbing";
          overlay.classList.add("dragged");
          overlay.classList.add("being-dragged");
        } else {
          header.style.cursor = "grabbing";
        }
      }

      if (!hasDragged) {
        return; // do not move until intent is clear
      }

      const x = lastMousePosition.x - dragOffset.x;
      const y = lastMousePosition.y - dragOffset.y;

      // keep overlay within viewport bounds
      const maxX = window.innerWidth - overlayContainer.offsetWidth;
      const maxY = window.innerHeight - overlayContainer.offsetHeight;

      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));

      // use transform instead of position to bypass CSS conflicts
      overlayContainer.style.setProperty(
        "transform",
        `translate(${boundedX}px, ${boundedY}px)`,
        "important"
      );

      // also set position to fixed with higher z-index to ensure it stays on top
      overlayContainer.style.setProperty("position", "fixed", "important");
      overlayContainer.style.setProperty("top", "0", "important");
      overlayContainer.style.setProperty("left", "0", "important");
      overlayContainer.style.setProperty("right", "auto", "important");
      overlayContainer.style.setProperty("bottom", "auto", "important");
    }

    function forceFinalPosition() {
      if (!finalDragPosition) return;

      let attempts = 0;
      const maxAttempts = 60; // 1 second at 60fps

      const forceInterval = setInterval(() => {
        attempts++;

        if (attempts > maxAttempts) {
          clearInterval(forceInterval);

          return;
        }

        // check if position has been overridden
        const currentLeft = overlayContainer.style.left;
        const currentTop = overlayContainer.style.top;
        const expectedLeft = finalDragPosition.x + "px";
        const expectedTop = finalDragPosition.y + "px";

        if (currentLeft !== expectedLeft || currentTop !== expectedTop) {
          // forcefully reapply ALL CSS with our position
          overlayContainer.style.cssText = `
            position: fixed !important;
            left: ${finalDragPosition.x}px !important;
            top: ${finalDragPosition.y}px !important;
            right: auto !important;
            bottom: auto !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            user-select: none !important;
          `;

          // also force the inner overlay positioning
          overlay.style.setProperty("position", "relative", "important");
          overlay.style.setProperty("top", "0", "important");
          overlay.style.setProperty("left", "0", "important");
          overlay.style.setProperty("right", "auto", "important");
          overlay.style.setProperty("bottom", "auto", "important");
        } else {
          // position is correct, stop forcing
          clearInterval(forceInterval);
          finalDragPosition = null; // clear stored position
        }
      }, 16); // ~60fps
    }

    function setupPositionGuard() {
      if (!finalDragPosition) return;

      // create mutation observer to watch for CSS changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            const currentLeft = overlayContainer.style.left;
            const currentTop = overlayContainer.style.top;
            const expectedLeft = finalDragPosition.x + "px";
            const expectedTop = finalDragPosition.y + "px";

            if (currentLeft !== expectedLeft || currentTop !== expectedTop) {
              // immediately force back
              overlayContainer.style.cssText = `
                position: fixed !important;
                left: ${finalDragPosition.x}px !important;
                top: ${finalDragPosition.y}px !important;
                right: auto !important;
                bottom: auto !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                user-select: none !important;
              `;
            }
          }
        });
      });

      // start observing
      observer.observe(overlayContainer, {
        attributes: true,
        attributeFilter: ["style"],
      });

      // stop observing after 2 seconds
      setTimeout(() => {
        observer.disconnect();
      }, 2000);
    }

    // unified drag functionality for both states
    function handleMouseDown(e) {
      // immediately stop propagation to prevent game interference
      e.stopImmediatePropagation();

      const isMinimized = overlay.classList.contains("minimized");

      if (isMinimized) {
        // for minimized state, allow dragging from anywhere on the circle
        startDrag(e);
      } else {
        // for expanded state, only allow dragging from header
        const headerElement = e.target.closest(".overlay-header");
        if (headerElement && e.target.tagName !== "BUTTON") {
          startDrag(e);
        }
      }
    }

    // single event listener on the overlay for all drag functionality
    // use capture mode and stop all propagation to override game events
    overlay.addEventListener("mousedown", handleMouseDown, true);

    // also add to overlayContainer to catch any missed events
    overlayContainer.addEventListener("mousedown", handleMouseDown, true);

    document.addEventListener(
      "mouseup",
      (e) => {
        if (!isDragging) return;

        const dx = lastMousePosition.x - dragStartPosition.x;
        const dy = lastMousePosition.y - dragStartPosition.y;
        const dist = Math.hypot(dx, dy);
        const heldMs = Date.now() - dragStartTime;
        const wasDrag =
          hasDragged || dist > MOVE_THRESHOLD_PX || heldMs > CLICK_THRESHOLD_MS;

        if (wasDrag) {
          // stop all event propagation immediately during an actual drag
          e.stopImmediatePropagation();
          e.preventDefault();
        }

        isDragging = false;

        // reset hasDragged flag after a short delay to allow click events to process
        setTimeout(() => {
          hasDragged = false;
        }, 100);

        // stop the polling interval
        if (dragPollingInterval) {
          clearInterval(dragPollingInterval);
          dragPollingInterval = null;
        }

        // if it wasn't a drag, let the click handler decide (e.g., expand when minimized)
        if (!wasDrag) {
          overlay.style.userSelect = "auto";
          document.body.style.userSelect = "auto";
          return;
        }

        // get current transform position and convert to fixed position
        const currentTransform = overlayContainer.style.transform;
        if (currentTransform && currentTransform.includes("translate")) {
          const matches = currentTransform.match(
            /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/
          );
          if (matches) {
            const finalX = parseFloat(matches[1]);
            const finalY = parseFloat(matches[2]);

            // clear transform first
            overlayContainer.style.removeProperty("transform");

            // completely override ALL CSS positioning with our final position
            overlayContainer.style.cssText = `
              position: fixed !important;
              left: ${finalX}px !important;
              top: ${finalY}px !important;
              right: auto !important;
              bottom: auto !important;
              z-index: 2147483647 !important;
              pointer-events: auto !important;
              user-select: none !important;
            `;

            // also force the inner overlay to use relative positioning
            overlay.style.setProperty("position", "relative", "important");
            overlay.style.setProperty("top", "0", "important");
            overlay.style.setProperty("left", "0", "important");
            overlay.style.setProperty("right", "auto", "important");
            overlay.style.setProperty("bottom", "auto", "important");

            // store the final position for forced reapplication
            finalDragPosition = { x: finalX, y: finalY };

            // force reapply position every frame until it sticks
            forceFinalPosition();

            // also set up mutation observer to catch CSS changes
            setupPositionGuard();

            // debug: check if position is being overridden multiple times
            setTimeout(() => {}, 50);
            setTimeout(() => {}, 200);
          }
        }

        // reset cursors based on current state
        const isMinimized = overlay.classList.contains("minimized");
        if (isMinimized) {
          overlay.style.cursor = "pointer";
        } else {
          header.style.cursor = "move";
        }

        overlay.style.userSelect = "auto"; // restore text selection
        document.body.style.userSelect = "auto"; // restore document selection
      },
      true
    );
  }

  // hide overlay
  function hideOverlay() {
    if (overlayContainer) {
      overlayContainer.style.display = "none";
      isOverlayVisible = false;
    }
  }

  // show overlay
  function showOverlay() {
    if (overlayContainer) {
      overlayContainer.style.display = "block";
      isOverlayVisible = true;
    } else {
      injectOverlay();
    }
  }

  // toggle overlay visibility
  function toggleOverlay() {
    if (isOverlayVisible) {
      hideOverlay();
    } else {
      showOverlay();
    }
  }

  // keyboard shortcut (ctrl+shift+m)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "M") {
      e.preventDefault();
      toggleOverlay();
    }
  });

  // listen for extension action clicks
  chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle_overlay") {
      toggleOverlay();
      sendResponse({ success: true });
    }
  });

  // auto-inject overlay when page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectOverlay);
  } else {
    // page already loaded
    setTimeout(injectOverlay, 1000); // small delay to ensure game ui is ready
  }
})();
