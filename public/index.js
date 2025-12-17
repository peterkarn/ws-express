class EventManager {
  constructor() {
    this.eventsList = [];
    this.eventsData = {};
    this.init();
  }

  async init() {
    await this.loadEvents();
    this.attachEventListeners();
  }

  async fetchEventsList() {
    const response = await fetch("/api/events");
    return await response.json();
  }

  async fetchEventsData() {
    const response = await fetch("/api/all-events");
    return await response.json();
  }

  async loadEvents() {
    try {
      [this.eventsList, this.eventsData] = await Promise.all([
        this.fetchEventsList(),
        this.fetchEventsData(),
      ]);

      this.populateEventSelect();
      this.handleEventChange();
    } catch (error) {
      console.log("Error loading events");
    }
  }

  populateEventSelect() {
    const select = document.getElementById("event");
    select.innerHTML = "";

    this.eventsList.forEach((evt) => {
      const option = document.createElement("option");
      option.value = evt.name;
      option.textContent = evt.name;
      select.appendChild(option);
    });
  }

  getDefaultPayload(eventName) {
    if (!this.eventsData[eventName]) return "";

    if (Array.isArray(this.eventsData[eventName])) {
      const firstVariant = this.eventsData[eventName][0];
      return firstVariant ? firstVariant.payload : "";
    }

    return this.eventsData[eventName];
  }

  updatePayloadDisplay() {
    const eventName = document.getElementById("event").value;
    const payload = this.getDefaultPayload(eventName);

    const formattedPayload = JSON.stringify(payload, null, 2);
    document.getElementById("payload").value = formattedPayload;
  }

  handleEventChange() {
    const eventName = document.getElementById("event").value;
    const eventObj = this.eventsList.find((ev) => ev.name === eventName);

    this.updateVariantSelect(eventObj);
    this.updatePayloadDisplay();
  }

  updateVariantSelect(eventObj) {
    const variantContainer = document.getElementById("variantContainer");
    const variantSelect = document.getElementById("variant");

    if (!variantContainer || !variantSelect) {
      return;
    }

    const hasVariants = eventObj?.variants?.length > 0;

    if (hasVariants) {
      variantContainer.style.display = "";
      this.populateVariants(variantSelect, eventObj.variants);
    } else {
      variantContainer.style.display = "none";
      variantSelect.innerHTML = "";
    }
  }

  populateVariants(selectElement, variants) {
    const previousValue = selectElement.value;
    selectElement.innerHTML = "";

    variants.forEach((variant) => {
      const option = document.createElement("option");
      option.value = variant;
      option.textContent = variant;
      selectElement.appendChild(option);
    });

    if (variants.includes(previousValue)) {
      selectElement.value = previousValue;
    }
  }

  async sendMockEvent() {
    const eventName = document.getElementById("event").value;
    const eventObj = this.eventsList.find((ev) => ev.name === eventName);
    const variantSelect = document.getElementById("variant");

    const requestBody = { eventName };

    if (eventObj?.variants && variantSelect) {
      requestBody.variant = variantSelect.value;
    }

    requestBody.payload = JSON.parse(document.getElementById("payload").value);

    const response = await fetch("/api/send-mock-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    this.displayStatus(`Event '${data.event}' sent!`, "green");
  }

  displayStatus(message, color) {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = message;
    statusDiv.style.color = color;

    setTimeout(() => {
      statusDiv.textContent = "";
    }, 3000);
  }

  attachEventListeners() {
    const eventSelect = document.getElementById("event");
    const variantSelect = document.getElementById("variant");
    const sendBtn = document.getElementById("sendBtn");

    if (eventSelect) {
      eventSelect.addEventListener("change", () => this.handleEventChange());
    }

    if (variantSelect) {
      variantSelect.addEventListener("change", () =>
        this.updatePayloadDisplay()
      );
    }

    if (sendBtn) {
      sendBtn.addEventListener("click", () => this.sendMockEvent());
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EventManager();
});
