document.addEventListener("DOMContentLoaded", () => {
  // Date Navigation Logic
  const dateItems = document.querySelectorAll(".date-item");
  const dayCards = document.querySelectorAll(".day-card");

  // Theme Toggle Logic
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector("i");

    // Check local storage
    const savedTheme = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
      // Update navbar background immediately
      const navbar = document.querySelector(".navbar");
      if (navbar && typeof updateNavbar === "function") {
        updateNavbar();
      }
    });

    function updateThemeIcon(theme) {
      if (theme === "dark") {
        themeIcon.className = "fa-solid fa-sun";
      } else {
        themeIcon.className = "fa-solid fa-moon";
      }
    }
  }

  // Function to switch active day
  window.switchDay = (dayId) => {
    // Update Day Cards
    dayCards.forEach((card) => {
      card.classList.remove("active");
      if (card.id === dayId) {
        card.classList.add("active");
      }
    });

    // Update Date Navigation
    dateItems.forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.target === `#${dayId}`) {
        item.classList.add("active");
        // Scroll nav item into view if needed
        item.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });

    // Scroll to top of itinerary view
    const itineraryView = document.querySelector(".itinerary-view");
    if (itineraryView) {
      const offset = itineraryView.offsetTop - 150; // Adjust for header
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  // Add click listeners to date items
  dateItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.dataset.target.substring(1); // remove #
      switchDay(targetId);
    });

    // Allow dragging over date items to switch days
    item.addEventListener("dragenter", (e) => {
      if (document.querySelector(".timeline-item.dragging")) {
        const targetId = item.dataset.target.substring(1);
        switchDay(targetId);
      }
    });

    // Allow dropping directly on the date tab
    item.addEventListener("dragover", (e) => {
      e.preventDefault(); // Necessary to allow dropping
      e.dataTransfer.dropEffect = "move";
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggable = document.querySelector(".dragging");
      if (draggable) {
        const targetId = item.dataset.target.substring(1);
        const targetCard = document.getElementById(targetId);
        if (targetCard) {
          const dayBody = targetCard.querySelector(".day-body");
          const addBtn = dayBody.querySelector(".add-item-row");

          // Append to the end (before add button)
          if (addBtn) dayBody.insertBefore(draggable, addBtn);
          else dayBody.appendChild(draggable);

          // Switch to that day
          switchDay(targetId);

          // Trigger updates
          validateSchedule(dayBody);
          updateDayLocation(targetId);
          saveSchedule();
        }
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");

  function updateNavbar() {
    const scrollY = window.scrollY;
    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const triggerHeight = pageHeight * 0.2; // 20% of scrollable page height

    // Calculate opacity: 0 at top, 1 at triggerHeight
    let opacity = scrollY / triggerHeight;

    // Clamp opacity between 0 and 1
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;

    // Apply background with calculated opacity
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const bgRGB = isDark ? "30, 30, 30" : "255, 255, 255";
    navbar.style.background = `rgba(${bgRGB}, ${opacity})`;

    // Apply shadow only when some opacity exists
    // navbar.style.boxShadow = `0 2px 10px rgba(0,0,0,${opacity * 0.1})`;
    navbar.style.boxShadow = "none"; // Remove shadow to enhance fade effect

    // Switch text color when background is solid enough (e.g., > 0.5 opacity)
    // or strictly when it reaches the target as per "100% solid" implication for state change
    if (opacity > 0.8) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Initial check
  updateNavbar();

  window.addEventListener("scroll", updateNavbar);

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
      if (navLinks.style.display === "flex") {
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "60px";
        navLinks.style.left = "0";
        navLinks.style.width = "100%";
        navLinks.style.background = "white";
        navLinks.style.padding = "1rem";
        navLinks.style.boxShadow = "0 5px 10px rgba(0,0,0,0.1)";
      }
    });
  }

  // Weather Configuration
  const SEOUL_COORDS = { lat: 37.5665, lon: 126.978 };
  const TRIP_START_DATE = "2024-12-28"; // Trip Start Date
  const TRIP_DAYS = 9;

  // WMO Weather Code Mapping
  const weatherCodeMap = {
    0: { icon: "fa-solid fa-sun", condition: "晴朗" },
    1: { icon: "fa-solid fa-cloud-sun", condition: "晴時多雲" },
    2: { icon: "fa-solid fa-cloud-sun", condition: "多雲" },
    3: { icon: "fa-solid fa-cloud", condition: "陰天" },
    45: { icon: "fa-solid fa-smog", condition: "霧" },
    48: { icon: "fa-solid fa-smog", condition: "霧" },
    51: { icon: "fa-solid fa-cloud-rain", condition: "毛毛雨" },
    53: { icon: "fa-solid fa-cloud-rain", condition: "毛毛雨" },
    55: { icon: "fa-solid fa-cloud-rain", condition: "毛毛雨" },
    61: { icon: "fa-solid fa-cloud-showers-heavy", condition: "小雨" },
    63: { icon: "fa-solid fa-cloud-showers-heavy", condition: "雨" },
    65: { icon: "fa-solid fa-cloud-showers-heavy", condition: "大雨" },
    71: { icon: "fa-regular fa-snowflake", condition: "小雪" },
    73: { icon: "fa-regular fa-snowflake", condition: "雪" },
    75: { icon: "fa-regular fa-snowflake", condition: "大雪" },
    77: { icon: "fa-regular fa-snowflake", condition: "雪粒" },
    80: { icon: "fa-solid fa-cloud-showers-water", condition: "陣雨" },
    81: { icon: "fa-solid fa-cloud-showers-water", condition: "陣雨" },
    82: { icon: "fa-solid fa-cloud-showers-water", condition: "強陣雨" },
    85: { icon: "fa-regular fa-snowflake", condition: "陣雪" },
    86: { icon: "fa-regular fa-snowflake", condition: "陣雪" },
    95: { icon: "fa-solid fa-bolt", condition: "雷雨" },
    96: { icon: "fa-solid fa-bolt", condition: "雷雨" },
    99: { icon: "fa-solid fa-bolt", condition: "雷雨" },
  };

  // Default/Fallback Data (Mock data based on Seoul historical averages)
  let weatherData = {
    day1: {
      temp: "-2°C / 3°C",
      humidity: "45%",
      icon: "fa-solid fa-sun",
      condition: "晴時多雲",
    },
    day2: {
      temp: "-4°C / 1°C",
      humidity: "40%",
      icon: "fa-solid fa-cloud-sun",
      condition: "多雲",
    },
    day3: {
      temp: "-6°C / 0°C",
      humidity: "55%",
      icon: "fa-regular fa-snowflake",
      condition: "小雪",
    },
    day4: {
      temp: "-5°C / 2°C",
      humidity: "40%",
      icon: "fa-solid fa-sun",
      condition: "晴朗",
    },
    day5: {
      temp: "-3°C / 4°C",
      humidity: "45%",
      icon: "fa-solid fa-cloud",
      condition: "陰天",
    },
    day6: {
      temp: "-7°C / -1°C",
      humidity: "35%",
      icon: "fa-solid fa-temperature-arrow-down",
      condition: "寒冷",
    },
    day7: {
      temp: "-5°C / 2°C",
      humidity: "40%",
      icon: "fa-solid fa-sun",
      condition: "晴朗",
    },
    day8: {
      temp: "-3°C / 3°C",
      humidity: "50%",
      icon: "fa-solid fa-cloud-sun",
      condition: "多雲",
    },
    day9: {
      temp: "-2°C / 4°C",
      humidity: "45%",
      icon: "fa-solid fa-plane",
      condition: "返程",
    },
  };

  function renderWeatherWidgets() {
    document.querySelectorAll(".day-card").forEach((card) => {
      const dayId = card.id;
      const data = weatherData[dayId];
      const header = card.querySelector(".day-header");

      // Remove existing widget if any
      const existing = header.querySelector(".weather-widget");
      if (existing) existing.remove();

      if (data) {
        const weatherDiv = document.createElement("div");
        weatherDiv.className = "weather-widget";
        weatherDiv.innerHTML = `
                  <i class="${data.icon} weather-icon" title="${data.condition}"></i>
                  <div class="weather-temp">${data.temp}</div>
                  <div class="weather-detail">
                      <span><i class="fa-solid fa-droplet"></i> ${data.humidity}</span>
                      <span>${data.condition}</span>
                  </div>
              `;
        header.appendChild(weatherDiv);
      }
    });
  }

  async function fetchWeather() {
    try {
      const startDate = new Date(TRIP_START_DATE);
      const endDate = new Date(TRIP_START_DATE);
      endDate.setDate(endDate.getDate() + TRIP_DAYS - 1);

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      // Check if dates are within forecast range (approx 14 days from now)
      const now = new Date();
      const maxForecastDate = new Date();
      maxForecastDate.setDate(now.getDate() + 14);

      if (startDate > maxForecastDate) {
        console.log(
          "Trip dates are too far in the future for precise forecast. Using historical averages/mock data."
        );
        return;
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL_COORDS.lat}&longitude=${SEOUL_COORDS.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=Asia%2FSeoul&start_date=${startStr}&end_date=${endStr}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.daily) {
        const newWeatherData = {};
        data.daily.time.forEach((time, index) => {
          const dayId = `day${index + 1}`;
          const code = data.daily.weather_code[index];
          const minTemp = Math.round(data.daily.temperature_2m_min[index]);
          const maxTemp = Math.round(data.daily.temperature_2m_max[index]);
          const humidity = Math.round(
            data.daily.relative_humidity_2m_mean[index]
          );

          const weatherInfo = weatherCodeMap[code] || {
            icon: "fa-solid fa-cloud",
            condition: "未知",
          };

          newWeatherData[dayId] = {
            temp: `${minTemp}°C / ${maxTemp}°C`,
            humidity: `${humidity}%`,
            icon: weatherInfo.icon,
            condition: weatherInfo.condition,
          };
        });

        weatherData = newWeatherData;
        renderWeatherWidgets();
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      alert("無法取得天氣資訊，將顯示預設資料。\n錯誤: " + error.message);
    }
  }

  // Initial Render & Fetch
  renderWeatherWidgets();
  fetchWeather();

  // Auto-generate Google Maps buttons, Edit buttons, and Add buttons
  document.querySelectorAll(".day-body").forEach((dayBody) => {
    // Add Edit/Map buttons to existing items
    dayBody
      .querySelectorAll(".timeline-item .content h3")
      .forEach((header, index) => {
        // Get text content but ignore the icon
        const locationName = header.innerText.trim();
        const timelineItem = header.closest(".timeline-item");

        // Assign a unique ID to each timeline item for editing purposes
        if (!timelineItem.id) {
          timelineItem.id = `item-${dayBody.closest(".day-card").id}-${index}`;
        }

        if (locationName) {
          // ... existing map button code ...
          const mapBtn = document.createElement("a");
          mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            locationName + " 首爾"
          )}`;
          mapBtn.target = "_blank";
          mapBtn.className = "map-btn";
          mapBtn.innerHTML = '<i class="fa-solid fa-location-dot"></i> 導航';
          mapBtn.title = `在 Google 地圖上查看 ${locationName}`;

          // Insert inside the header, after the text
          header.appendChild(mapBtn);
        }

        // Add Edit Button
        const editBtn = document.createElement("i");
        editBtn.className = "fa-solid fa-pen edit-btn";
        editBtn.title = "編輯行程";
        editBtn.onclick = (e) => {
          e.stopPropagation();
          openEditModal(timelineItem.id);
        };
        header.appendChild(editBtn);
      });

    // Add "Add Schedule" button at the end of the timeline (aligned with line)
    const addBtnItem = document.createElement("div");
    addBtnItem.className = "timeline-item add-item-row";
    addBtnItem.innerHTML = `
            <div class="time-badge-spacer"></div>
            <button class="add-circle-btn" title="新增行程"><i class="fa-solid fa-plus"></i></button>
        `;
    addBtnItem.onclick = () => openAddModal(dayBody.closest(".day-card").id);
    dayBody.appendChild(addBtnItem);
  });

  // Edit Modal Logic
  const modal = document.getElementById("editModal");
  const closeBtn = document.querySelector(".close-modal");
  const cancelBtn = document.getElementById("cancelEdit");
  const deleteBtn = document.getElementById("deleteItemBtn");
  const editForm = document.getElementById("editForm");

  // Currency Rates (Approximate)
  const rates = {
    KRW: 0.0056,
    TWD: 0.24,
    USD: 7.8,
    JPY: 0.052,
    HKD: 1,
  };

  // Delete Button Logic
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      const itemId = document.getElementById("editItemId").value;
      if (itemId) {
        if (confirm("確定要刪除此行程嗎？")) {
          const item = document.getElementById(itemId);
          if (item) {
            const dayBody = item.closest(".day-body");
            item.remove();
            if (dayBody) {
              validateSchedule(dayBody);
              updateDayLocation(dayBody.closest(".day-card").id);
              saveSchedule();
            }
            closeModal();
          }
        }
      }
    };
  }

  window.openAddModal = (dayId) => {
    // Clear Form
    document.getElementById("editItemId").value = "";
    document.getElementById("editDayId").value = dayId;
    document.getElementById("editStartTime").value = "";
    document.getElementById("editEndTime").value = "";
    document.getElementById("editTitle").value = "";
    document.getElementById("editArea").value = "";
    document.getElementById("editIcon").value = "";
    document.getElementById("editIconColor").value = "#2c3e50";
    document.getElementById("editTag").value = "";
    document.getElementById("editMapQuery").value = "";
    document.getElementById("editDescription").value = "";
    document.getElementById("editCost").value = "";
    document.getElementById("editCurrency").value = "KRW";
    document.getElementById("editLink").value = "";

    // Hide Delete Button
    if (deleteBtn) deleteBtn.style.display = "none";

    // Update Icon Preview
    const preview = document.getElementById("iconPreview");
    if (preview) {
      preview.className = "";
      preview.style.color = "#2c3e50";
    }

    // Change Modal Title
    document.querySelector(".modal-header h2").innerText = "新增行程";

    modal.style.display = "block";
  };

  window.openEditModal = (itemId) => {
    const item = document.getElementById(itemId);
    if (!item) return;

    // Show Delete Button
    if (deleteBtn) deleteBtn.style.display = "block";

    // Change Modal Title
    document.querySelector(".modal-header h2").innerText = "編輯行程";

    // Populate Form
    document.getElementById("editItemId").value = itemId;
    document.getElementById("editDayId").value = ""; // Clear day ID for edit mode

    // Time
    const timeBadge = item.querySelector(".time-badge").innerText;
    const times = timeBadge.split(" - ");
    document.getElementById("editStartTime").value = times[0] || "";
    document.getElementById("editEndTime").value = times[1] || "";

    // Title & Icon
    const header = item.querySelector(".content h3");
    const icon = header.querySelector("i:not(.edit-btn)"); // Exclude edit button

    // Clone header to safely extract text without buttons/icons
    const headerClone = header.cloneNode(true);
    headerClone
      .querySelectorAll(".map-btn, .edit-btn, i:not(.edit-btn)")
      .forEach((el) => el.remove());
    const titleText = headerClone.textContent.trim();

    document.getElementById("editTitle").value = titleText;
    document.getElementById("editArea").value = item.dataset.area || "";
    document.getElementById("editIcon").value = icon ? icon.className : "";

    // Color
    // Check for inline style first, then computed style
    let color = "#2c3e50"; // Default primary color
    if (icon) {
      if (icon.style.color) {
        // Convert rgb to hex if necessary, but input type=color needs hex
        // Simple check if it's hex
        if (icon.style.color.startsWith("#")) {
          color = icon.style.color;
        } else {
          // It might be rgb(...) or name.
          // For simplicity, let's try to get computed style if inline is not hex or complex
          // But actually, input type=color ONLY accepts 7-character hex.
          // We need a helper to convert.
          // For now, let's rely on computed style and convert it.
        }
      }

      // Get computed color to be safe
      const computedColor = window.getComputedStyle(icon).color;
      // Convert rgb(r, g, b) to hex
      const rgb = computedColor.match(/\d+/g);
      if (rgb) {
        color =
          "#" +
          (
            (1 << 24) +
            (parseInt(rgb[0]) << 16) +
            (parseInt(rgb[1]) << 8) +
            parseInt(rgb[2])
          )
            .toString(16)
            .slice(1);
      }
    }
    document.getElementById("editIconColor").value = color;

    // Update Icon Preview
    const preview = document.getElementById("iconPreview");
    if (preview) {
      preview.className = icon ? icon.className : "";
      preview.style.color = color;
    }

    // Map Query
    const mapBtn = item.querySelector(".map-btn");
    let mapQuery = "";
    if (mapBtn) {
      const urlParams = new URLSearchParams(mapBtn.href.split("?")[1]);
      mapQuery = decodeURIComponent(urlParams.get("query") || "").replace(
        " 首爾",
        ""
      );
    }
    document.getElementById("editMapQuery").value =
      mapQuery === titleText ? "" : mapQuery;

    // Description
    const desc = item.querySelector(".content p");
    document.getElementById("editDescription").value = desc
      ? desc.innerText
      : "";

    // Cost & Tag
    const tag = item.querySelector(".tag");
    document.getElementById("editTag").value = tag ? tag.innerText : "";

    // Parse Cost
    const contentDiv = item.querySelector(".content");
    let foundCost = false;

    // Iterate over text nodes to find cost pattern
    const textNodes = Array.from(contentDiv.childNodes).filter(
      (node) =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
    );

    for (const node of textNodes) {
      const text = node.textContent;
      // Match number (with commas) followed by currency
      const match = text.match(/([\d,]+)\s*(KRW|TWD|HKD|USD|JPY)/i);
      if (match) {
        const amount = match[1].replace(/,/g, "");
        const currency = match[2].toUpperCase();
        document.getElementById("editCost").value = amount;
        document.getElementById("editCurrency").value = currency;
        foundCost = true;
        break;
      }
    }

    if (!foundCost) {
      document.getElementById("editCost").value = "";
      document.getElementById("editCurrency").value = "KRW";
    }

    // Link
    const link = item.querySelector(".content a:not(.map-btn)");
    document.getElementById("editLink").value = link ? link.href : "";

    modal.style.display = "block";
  };

  function closeModal() {
    modal.style.display = "none";
  }

  closeBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;
  window.onclick = (event) => {
    if (event.target == modal) {
      closeModal();
    }
  };

  editForm.onsubmit = (e) => {
    e.preventDefault();
    try {
      const itemId = document.getElementById("editItemId").value;
      const dayId = document.getElementById("editDayId").value;

      // Get Values
      const startTime = document.getElementById("editStartTime").value;
      const endTime = document.getElementById("editEndTime").value;
      const title = document.getElementById("editTitle").value;
      const area = document.getElementById("editArea").value;
      const iconClass = document.getElementById("editIcon").value;
      const iconColor = document.getElementById("editIconColor").value;
      const tag = document.getElementById("editTag").value;
      const mapQuery = document.getElementById("editMapQuery").value || title;
      const description = document.getElementById("editDescription").value;
      const cost = document.getElementById("editCost").value;
      const currency = document.getElementById("editCurrency").value;
      const linkUrl = document.getElementById("editLink").value;

      let item;
      let isNew = false;

      if (itemId) {
        // Edit Mode
        item = document.getElementById(itemId);
      } else {
        // Add Mode
        isNew = true;
        item = document.createElement("div");
        item.className = "timeline-item";
        // Generate a temporary ID
        item.id = `new-item-${Date.now()}`;

        // Create structure
        item.innerHTML = `
                  <div class="time-badge"></div>
                  <div class="content">
                      <h3></h3>
                      <p></p>
                  </div>
              `;
      }

      if (!item) return;

      // Update DOM

      // Save Area to data attribute
      item.dataset.area = area;

      // Time
      let timeStr = startTime;
      if (endTime) timeStr += ` - ${endTime}`;
      item.querySelector(".time-badge").innerText = timeStr;

      // Header (Icon + Title + Map + Edit)
      const header = item.querySelector(".content h3");
      header.innerHTML = ""; // Clear

      if (iconClass) {
        const i = document.createElement("i");
        i.className = iconClass;
        i.style.color = iconColor;
        header.appendChild(i);
        header.appendChild(document.createTextNode(" "));
      }

      header.appendChild(document.createTextNode(title));

      // Re-add Map Button
      const mapBtn = document.createElement("a");
      mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapQuery + " 首爾"
      )}`;
      mapBtn.target = "_blank";
      mapBtn.className = "map-btn";
      mapBtn.innerHTML = '<i class="fa-solid fa-location-dot"></i> 導航';
      header.appendChild(mapBtn);

      // Re-add Edit Button
      const editBtn = document.createElement("i");
      editBtn.className = "fa-solid fa-pen edit-btn";
      editBtn.title = "編輯行程";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        openEditModal(item.id);
      };
      header.appendChild(editBtn);

      // Description
      let p = item.querySelector(".content p");
      if (!p) {
        p = document.createElement("p");
        const h3 = item.querySelector(".content h3");
        if (h3 && h3.nextSibling) {
          item.querySelector(".content").insertBefore(p, h3.nextSibling);
        } else {
          item.querySelector(".content").appendChild(p);
        }
      }
      p.innerText = description;

      // Tag & Cost
      // Remove old tag and cost text nodes
      const content = item.querySelector(".content");

      // Ensure p is a direct child of content before relying on sibling logic relative to content
      // Or better, just remove all siblings following p
      if (p && p.parentNode === content) {
        let nextNode = p.nextSibling;
        while (nextNode) {
          const toRemove = nextNode;
          nextNode = nextNode.nextSibling;
          toRemove.remove(); // Safer: remove from its own parent
        }
      }

      if (tag) {
        const tagSpan = document.createElement("span");
        tagSpan.className = "tag";
        tagSpan.innerText = tag;
        content.appendChild(tagSpan);
        content.appendChild(document.createTextNode(" "));
      }

      if (cost) {
        const rate = rates[currency] || 0;
        const hkdCost = Math.round(cost * rate);
        const costText = `${parseInt(
          cost
        ).toLocaleString()} ${currency} (≈ HK$ ${hkdCost.toLocaleString()})`;
        content.appendChild(document.createTextNode(costText));
      }

      if (linkUrl) {
        content.appendChild(document.createElement("br"));
        const link = document.createElement("a");
        link.href = linkUrl;
        link.target = "_blank";
        link.innerHTML = '<i class="fa-solid fa-link"></i> 參考連結';
        link.style.fontSize = "0.9rem";
        link.style.marginTop = "5px";
        link.style.display = "inline-block";
        content.appendChild(link);
      }

      if (isNew) {
        const dayCard = document.getElementById(dayId);
        if (dayCard) {
          const dayBody = dayCard.querySelector(".day-body");
          // Insert before the add button row
          const addBtn = dayBody.querySelector(".add-item-row");
          if (addBtn) {
            dayBody.insertBefore(item, addBtn);
          } else {
            dayBody.appendChild(item);
          }
          attachDragListeners(item);
        }
      }

      // Re-validate schedule after edit
      const dayBody = item.closest(".day-body");
      if (dayBody) {
        validateSchedule(dayBody);
        updateDayLocation(dayBody.closest(".day-card").id);
        saveSchedule(); // Save after edit/add
      }

      closeModal();
    } catch (err) {
      console.error("Error saving schedule:", err);
      alert("儲存時發生錯誤: " + err.message);
    }
  }; // Icon Preview Logic
  const iconInput = document.getElementById("editIcon");
  const iconColorInput = document.getElementById("editIconColor");
  const iconPreview = document.getElementById("iconPreview");
  const resetColorBtn = document.getElementById("resetColorBtn");
  const DEFAULT_COLOR = "#2c3e50";

  function updatePreview() {
    if (iconPreview) {
      iconPreview.className = iconInput.value || "";
      iconPreview.style.color = iconColorInput.value;
    }
  }

  if (iconInput && iconPreview && iconColorInput) {
    iconInput.addEventListener("input", updatePreview);
    iconColorInput.addEventListener("input", updatePreview);

    if (resetColorBtn) {
      resetColorBtn.addEventListener("click", () => {
        iconColorInput.value = DEFAULT_COLOR;
        updatePreview();
      });
    }
  }

  // Initialize AOS-like fade in for summary section
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos="fade-up"]').forEach((element) => {
    observer.observe(element);
  });

  // Initialize on load
  restoreSchedule();

  // File Export/Import
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importInput = document.getElementById("importInput");
  const resetBtn = document.getElementById("resetBtn");

  if (exportBtn) {
    exportBtn.addEventListener("click", exportSchedule);
  }

  if (importBtn && importInput) {
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", importSchedule);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (
        confirm(
          "確定要重置所有行程回到預設狀態嗎？\n這將會清除您目前所有的編輯紀錄。"
        )
      ) {
        localStorage.removeItem("seoulTripSchedule");
        location.reload();
      }
    });
  }

  // If no schedule was restored (first time), we still need to init drag and drop and validation
  // But restoreSchedule already does that if it runs.
  // If it didn't run (no data), we rely on the static HTML.
  // However, we need to make sure we don't double-init.
  // Let's check if we restored.

  if (!localStorage.getItem("seoulTripSchedule")) {
    document
      .querySelectorAll(".day-card")
      .forEach((card) => updateDayLocation(card.id));
    initDragAndDrop();
    document.querySelectorAll(".day-body").forEach(validateSchedule);
  }
});

// Persistence Logic

function serializeSchedule() {
  const data = {};
  document.querySelectorAll(".day-card").forEach((card) => {
    const dayId = card.id;
    const items = [];
    card
      .querySelectorAll(".timeline-item:not(.add-item-row)")
      .forEach((item) => {
        // Extract Data
        const timeBadgeEl = item.querySelector(".time-badge");
        const timeBadge = timeBadgeEl ? timeBadgeEl.innerText : "";

        const titleHeader = item.querySelector(".content h3");
        let title = "";
        let iconClass = "";
        let iconColor = "";

        if (titleHeader) {
          // Clone header to get clean title
          const headerClone = titleHeader.cloneNode(true);
          headerClone
            .querySelectorAll(".map-btn, .edit-btn, i:not(.edit-btn)")
            .forEach((el) => el.remove());
          title = headerClone.textContent.trim();

          const icon = titleHeader.querySelector("i:not(.edit-btn)");
          iconClass = icon ? icon.className : "";
          iconColor = icon ? icon.style.color : "";
        }

        const description = item.querySelector(".content p")?.innerText || "";
        const tag = item.querySelector(".tag")?.innerText || "";

        let costText = "";
        const contentDiv = item.querySelector(".content");
        if (contentDiv) {
          const textNodes = Array.from(contentDiv.childNodes).filter(
            (node) =>
              node.nodeType === Node.TEXT_NODE &&
              node.textContent.trim().length > 0
          );
          for (const node of textNodes) {
            if (node.textContent.match(/([\d,]+)\s*(KRW|TWD|HKD|USD|JPY)/i)) {
              costText = node.textContent.trim();
              break;
            }
          }
        }

        const link = item.querySelector(".content a:not(.map-btn)");
        const linkUrl = link ? link.href : "";

        const mapBtn = item.querySelector(".map-btn");
        let mapQuery = "";
        if (mapBtn) {
          const urlParams = new URLSearchParams(mapBtn.href.split("?")[1]);
          mapQuery = decodeURIComponent(urlParams.get("query") || "").replace(
            " 首爾",
            ""
          );
        }

        items.push({
          id: item.id,
          time: timeBadge,
          area: item.dataset.area || "",
          title,
          iconClass,
          iconColor,
          description,
          tag,
          costText,
          linkUrl,
          mapQuery,
        });
      });
    data[dayId] = items;
  });
  return data;
}

function saveSchedule(exportToFile = false) {
  try {
    const data = serializeSchedule();
    localStorage.setItem("seoulTripSchedule", JSON.stringify(data));

    if (exportToFile) {
      exportSchedule();
    }
  } catch (e) {
    console.error("Failed to save schedule:", e);
  }
}

function exportSchedule() {
  const data = serializeSchedule();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "seoul-trip-schedule.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importSchedule(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      restoreSchedule(data);
      saveSchedule(false); // Save to localStorage but don't export again
      alert("行程匯入成功！");
    } catch (err) {
      alert("匯入失敗：檔案格式錯誤");
      console.error(err);
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };
  reader.readAsText(file);
}

function restoreSchedule(data = null) {
  if (!data) {
    const json = localStorage.getItem("seoulTripSchedule");
    if (json) {
      try {
        data = JSON.parse(json);
      } catch (e) {
        console.error("Failed to parse schedule data:", e);
        return;
      }
    }
  }

  if (!data) return;

  Object.keys(data).forEach((dayId) => {
    const dayCard = document.getElementById(dayId);
    if (!dayCard) return;

    const dayBody = dayCard.querySelector(".day-body");
    // Clear existing content safely
    while (dayBody.firstChild) {
      dayBody.removeChild(dayBody.firstChild);
    }

    const items = data[dayId];
    if (Array.isArray(items)) {
      items.forEach((itemData) => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.id = itemData.id || `restored-${Date.now()}-${Math.random()}`;
        item.dataset.area = itemData.area || "";
        item.setAttribute("draggable", "true");

        // Time Badge
        const timeBadge = document.createElement("div");
        timeBadge.className = "time-badge";
        timeBadge.innerText = itemData.time || "";
        item.appendChild(timeBadge);

        // Content
        const content = document.createElement("div");
        content.className = "content";

        // Header (H3)
        const h3 = document.createElement("h3");

        // Icon
        if (itemData.iconClass) {
          const icon = document.createElement("i");
          icon.className = itemData.iconClass;
          if (itemData.iconColor) icon.style.color = itemData.iconColor;
          h3.appendChild(icon);
          h3.appendChild(document.createTextNode(" "));
        }

        // Title
        h3.appendChild(document.createTextNode(itemData.title || ""));
        h3.appendChild(document.createTextNode(" "));

        // Map Button
        const mapQuery = itemData.mapQuery || itemData.title;
        if (mapQuery) {
          const mapBtn = document.createElement("a");
          mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            mapQuery + " 首爾"
          )}`;
          mapBtn.target = "_blank";
          mapBtn.className = "map-btn";
          mapBtn.innerHTML = '<i class="fa-solid fa-location-dot"></i> 導航';
          h3.appendChild(mapBtn);
          h3.appendChild(document.createTextNode(" "));
        }

        // Edit Button
        const editBtn = document.createElement("i");
        editBtn.className = "fa-solid fa-pen edit-btn";
        editBtn.title = "編輯行程";
        editBtn.onclick = (e) => {
          e.stopPropagation();
          openEditModal(item.id);
        };
        h3.appendChild(editBtn);

        content.appendChild(h3);

        // Description
        const p = document.createElement("p");
        p.innerText = itemData.description || "";
        content.appendChild(p);

        // Tag
        if (itemData.tag) {
          const tagSpan = document.createElement("span");
          tagSpan.className = "tag";
          tagSpan.innerText = itemData.tag;
          content.appendChild(tagSpan);
          content.appendChild(document.createTextNode(" "));
        }

        // Cost
        if (itemData.costText) {
          content.appendChild(document.createTextNode(itemData.costText));
        }

        // Link
        if (itemData.linkUrl) {
          content.appendChild(document.createElement("br"));
          const link = document.createElement("a");
          link.href = itemData.linkUrl;
          link.target = "_blank";
          link.style.fontSize = "0.9rem";
          link.style.marginTop = "5px";
          link.style.display = "inline-block";
          link.innerHTML = '<i class="fa-solid fa-link"></i> 參考連結';
          content.appendChild(link);
        }

        item.appendChild(content);

        // Attach Drag Listeners
        attachDragListeners(item);

        dayBody.appendChild(item);
      });
    }

    // Append Add Button
    const addBtnItem = document.createElement("div");
    addBtnItem.className = "timeline-item add-item-row";
    addBtnItem.innerHTML = `
            <div class="time-badge-spacer"></div>
            <button class="add-circle-btn" title="新增行程"><i class="fa-solid fa-plus"></i></button>
        `;
    addBtnItem.onclick = () => openAddModal(dayId);
    dayBody.appendChild(addBtnItem);

    // Update Location Tag
    updateDayLocation(dayId);
    validateSchedule(dayBody);
  });

  // Init Drag Drop for containers (Only once)
  setupDragAndDropContainers();
}

function setupDragAndDropContainers() {
  const dayBodies = document.querySelectorAll(".day-body");
  dayBodies.forEach((container) => {
    // Remove existing listeners to prevent duplicates if called multiple times
    // Note: This is tricky with anonymous functions.
    // Better to just ensure this function is only called once or use a flag.
    if (container.dataset.dragInitialized) return;

    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (draggable) {
        if (afterElement == null) {
          const addBtn = container.querySelector(".add-item-row");
          if (addBtn) container.insertBefore(draggable, addBtn);
          else container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      }
    });
    container.dataset.dragInitialized = "true";
  });
}

// --- Global Helper Functions ---

// Helper: Parse time string "HH:mm" to minutes
function parseTime(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper: Validate schedule for a specific day container
function validateSchedule(dayBody) {
  const items = Array.from(
    dayBody.querySelectorAll(".timeline-item:not(.add-item-row)")
  );

  items.forEach((item, index) => {
    const timeBadge = item.querySelector(".time-badge");
    if (!timeBadge) return;

    const timeText = timeBadge.innerText.trim();
    const [startStr, endStr] = timeText.split(" - ");

    const currentStart = parseTime(startStr);
    const currentEnd = endStr ? parseTime(endStr) : null;

    let hasConflict = false;

    // Check internal consistency (End > Start)
    if (currentEnd !== null && currentEnd <= currentStart) {
      hasConflict = true;
    }

    // Check against previous item
    if (index > 0) {
      const prevItem = items[index - 1];
      const prevTimeText = prevItem
        .querySelector(".time-badge")
        .innerText.trim();
      const [prevStartStr, prevEndStr] = prevTimeText.split(" - ");
      const prevStart = parseTime(prevStartStr);
      const prevEnd = prevEndStr ? parseTime(prevEndStr) : null;

      // Conflict if current starts before previous starts
      if (currentStart < prevStart) {
        hasConflict = true;
      }

      // Conflict if current starts before previous ends
      if (prevEnd !== null && currentStart < prevEnd) {
        hasConflict = true;
      }
    }

    if (hasConflict) {
      timeBadge.classList.add("conflict");
      timeBadge.title = "時間衝突！請檢查行程順序。";
    } else {
      timeBadge.classList.remove("conflict");
      timeBadge.title = "";
    }
  });
}

// Initialize Drag and Drop
function initDragAndDrop() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach(attachDragListeners);
  setupDragAndDropContainers();
}

// Helper to find insertion point
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(
      ".timeline-item:not(.dragging):not(.add-item-row)"
    ),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Helper: Update Location Tag based on schedule items
function updateDayLocation(dayId) {
  const dayCard = document.getElementById(dayId);
  if (!dayCard) return;

  const items = dayCard.querySelectorAll(".timeline-item");
  const locations = [];

  items.forEach((item) => {
    // Priority: data-area > title
    let text = item.dataset.area;

    if (!text) {
      const header = item.querySelector(".content h3");
      if (header) {
        const clone = header.cloneNode(true);
        clone
          .querySelectorAll(".map-btn, .edit-btn, i")
          .forEach((el) => el.remove());
        text = clone.textContent.trim();

        // Cleanup title
        text = text.replace(/\s*\(.*?\)/g, "");
        text = text.replace(/^(Dinner|Lunch|晚餐|午餐):\s*/i, "");
      }
    }

    if (text && !locations.includes(text)) {
      locations.push(text);
    }
  });

  // Filter: If we have items with explicit "data-area", prefer showing those only?
  const hasExplicitArea = Array.from(items).some((item) => item.dataset.area);

  let finalLocations = locations;
  if (hasExplicitArea) {
    const areaLocations = [];
    items.forEach((item) => {
      if (item.dataset.area) {
        if (!areaLocations.includes(item.dataset.area)) {
          areaLocations.push(item.dataset.area);
        }
      }
    });
    finalLocations = areaLocations;
  }

  // Take top 2
  let locationText = "首爾自由行";
  if (finalLocations.length > 0) {
    locationText = finalLocations.slice(0, 2).join(" / ");
  }

  const tag = dayCard.querySelector(".location-tag");
  if (tag) {
    tag.textContent = locationText;
  }
}

// Helper: Attach drag events to a single item
function attachDragListeners(item) {
  if (item.dataset.dragInitialized) return;

  item.setAttribute("draggable", "true");

  // Mouse Drag Events
  item.addEventListener("dragstart", (e) => {
    item.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
    // Validate the container where the item was dropped
    const dayBody = item.closest(".day-body");
    if (dayBody) {
      validateSchedule(dayBody);
      updateDayLocation(dayBody.closest(".day-card").id);
      saveSchedule();
    }
  });

  // Touch Drag Events (Mobile Support)
  let touchTimer = null;
  let isDragging = false;
  let startY = 0;

  item.addEventListener("touchstart", (e) => {
    if (e.touches.length > 1) return;
    startY = e.touches[0].clientY;
    
    // Long press to start drag (300ms)
    touchTimer = setTimeout(() => {
      isDragging = true;
      item.classList.add("dragging");
      if (navigator.vibrate) navigator.vibrate(50);
    }, 300);
  }, { passive: false });

  item.addEventListener("touchmove", (e) => {
    if (!isDragging) {
      // If moved significantly before timer fires, cancel drag (it's a scroll)
      const currentY = e.touches[0].clientY;
      if (Math.abs(currentY - startY) > 10) {
        clearTimeout(touchTimer);
      }
      return;
    }

    e.preventDefault(); // Prevent scrolling while dragging
    
    const touch = e.touches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elementBelow) return;

    const container = elementBelow.closest(".day-body");
    if (container) {
      const afterElement = getDragAfterElement(container, touch.clientY);
      const addBtn = container.querySelector(".add-item-row");
      
      if (afterElement == null) {
        if (addBtn) container.insertBefore(item, addBtn);
        else container.appendChild(item);
      } else {
        container.insertBefore(item, afterElement);
      }
    }
  }, { passive: false });

  item.addEventListener("touchend", (e) => {
    clearTimeout(touchTimer);
    if (isDragging) {
      isDragging = false;
      item.classList.remove("dragging");
      
      const dayBody = item.closest(".day-body");
      if (dayBody) {
        validateSchedule(dayBody);
        updateDayLocation(dayBody.closest(".day-card").id);
        saveSchedule();
      }
    }
  });

  item.dataset.dragInitialized = "true";
}
