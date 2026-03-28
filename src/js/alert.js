async function getAlerts() {
  const response = await fetch("/json/alerts.json");

  if (!response.ok) {
    throw new Error("Could not load alerts.");
  }

  return response.json();
}

function createAlertList(alerts) {
  if (!alerts || !alerts.length) return null;

  const section = document.createElement("section");
  section.classList.add("alert-list");

  alerts.forEach((alert) => {
    const p = document.createElement("p");
    p.textContent = alert.message;
    p.style.backgroundColor = alert.background;
    p.style.color = alert.color;
    section.appendChild(p);
  });

  return section;
}

export default async function loadAlerts() {
  try {
    const alerts = await getAlerts();
    const alertList = createAlertList(alerts);

    if (!alertList) return;

    const main = document.querySelector("main");
    if (main) {
      main.prepend(alertList);
    }
  } catch (error) {
    console.log("No alerts to display.");
  }
}