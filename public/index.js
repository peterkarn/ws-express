document.addEventListener("DOMContentLoaded", function () {
  let eventsList = [];
  let eventsData = {};

  async function loadEvents() {
    const res = await fetch("/api/events");
    eventsList = await res.json();

    const dataRes = await fetch("/api/all-events");
    eventsData = await dataRes.json();

    const select = document.getElementById("event");

    select.innerHTML = "";

    eventsList.forEach((evt) => {
      const option = document.createElement("option");

      option.value = evt.name;

      option.textContent = evt.name;

      select.appendChild(option);
    });

    handleEventChange();
  }

  function getDefaultPayload(eventName, variant) {
    if (!eventsData[eventName]) return "";

    if (Array.isArray(eventsData[eventName])) {
      if (!variant) return "";

      const foundVariant = eventsData[eventName].find(
        (v) => v.variant === variant
      );

      return foundVariant ? foundVariant.payload : "";
    }

    return eventsData[eventName];
  }

  function updatePayload() {
    const eventName = document.getElementById("event").value;
    const variantSelect = document.getElementById("variant");
    let variantValue = undefined;

    if (variantSelect) variantValue = variantSelect.value;

    const payload = getDefaultPayload(eventName, variantValue);

    document.getElementById("payload").value = JSON.stringify(payload, null, 2);
  }

  function handleEventChange() {
    const eventName = document.getElementById("event").value;
    const eventObj = eventsList.find((ev) => ev.name === eventName);
    const variantContainer = document.getElementById("variantContainer");
    const variantSelect = document.getElementById("variant");

    if (variantContainer && variantSelect) {
      const previouslySelectedVariant = variantSelect.value;

      if (eventObj && eventObj.variants && eventObj.variants.length > 0) {
        variantContainer.style.display = "";
        variantSelect.innerHTML = "";
        eventObj.variants.forEach((v) => {
          const option = document.createElement("option");
          option.value = v;
          option.textContent = v;
          variantSelect.appendChild(option);
        });

        if (eventObj.variants.includes(previouslySelectedVariant)) {
          variantSelect.value = previouslySelectedVariant;
        } else {
          variantSelect.value = eventObj.variants[0];
        }
      } else {
        variantContainer.style.display = "none";
        variantSelect.innerHTML = "";
        variantSelect.value = "";
      }
    } else if (variantContainer) {
      variantContainer.style.display = "none";
    }

    updatePayload();
  }

  function delayedResetTextMessage() {
    setTimeout(() => {
      document.getElementById("status").textContent = "";
    }, 3000);
  }

  if (document.getElementById("event")) {
    document.getElementById("event").onchange = handleEventChange;
  }

  if (document.getElementById("variant")) {
    document.getElementById("variant").onchange = updatePayload;
  }

  if (document.getElementById("sendBtn")) {
    document.getElementById("sendBtn").onclick = async function () {
      const eventName = document.getElementById("event").value;
      const eventObj = eventsList.find((ev) => ev.name === eventName);
      const variantSelect = document.getElementById("variant");
      let body = { eventName };

      if (eventObj && eventObj.variants && variantSelect) {
        body.variant = variantSelect.value;
      }

      body.payload = JSON.parse(document.getElementById("payload").value);

      const res = await fetch("/api/send-mock-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const statusDiv = document.getElementById("status");

      if (res.ok) {
        const data = await res.json();
        statusDiv.textContent = `Event '${data.event}'${
          data.variant ? " (" + data.variant + ")" : ""
        } sent!`;
        statusDiv.style.color = "green";
      } else {
        const err = await res.json();
        statusDiv.textContent = err.error || "Error sending event";
        statusDiv.style.color = "red";
      }

      delayedResetTextMessage();
    };
  }

  loadEvents();
});
