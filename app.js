const STORAGE_KEY = "fatLossActivityDashboard.entries";

const habitKeys = ["fasting", "protein", "lowSugar", "lightDinner", "sleep", "stress"];
const pillConfig = [
  ["fasting", "12:12"],
  ["extendedFast", "14:10"],
  ["protein", "Protein"],
  ["lowSugar", "Low sugar"],
  ["lightDinner", "Light dinner"],
  ["sleep", "Sleep"],
  ["stress", "Reset"],
];

const form = document.querySelector("#daily-form");
const dateInput = document.querySelector("#entry-date");
const weekGrid = document.querySelector("#week-grid");
const clearButton = document.querySelector("#clear-day");

const formatDate = (date) => date.toISOString().slice(0, 10);
const todayKey = formatDate(new Date());

dateInput.value = todayKey;

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getWeekDates(anchor = new Date()) {
  const start = new Date(anchor);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function readForm() {
  const data = new FormData(form);
  return {
    date: data.get("date"),
    fasting: data.get("fasting") === "on",
    extendedFast: data.get("extendedFast") === "on",
    protein: data.get("protein") === "on",
    lowSugar: data.get("lowSugar") === "on",
    lightDinner: data.get("lightDinner") === "on",
    sleep: data.get("sleep") === "on",
    stress: data.get("stress") === "on",
    strength: Number(data.get("strength") || 0),
    walks: Number(data.get("walks") || 0),
    hiit: Number(data.get("hiit") || 0),
    golf: Number(data.get("golf") || 0),
    weight: data.get("weight") ? Number(data.get("weight")) : "",
    notes: data.get("notes")?.trim() ?? "",
  };
}

function fillForm(entry = {}) {
  form.reset();
  dateInput.value = entry.date ?? dateInput.value ?? todayKey;

  [...form.elements].forEach((field) => {
    if (!field.name || field.name === "date") return;
    if (field.type === "checkbox") {
      field.checked = Boolean(entry[field.name]);
      return;
    }
    field.value = entry[field.name] ?? (field.name === "weight" ? "" : field.type === "number" ? 0 : "");
  });
}

function completionScore(entry) {
  if (!entry) return 0;
  const completed = habitKeys.filter((key) => entry[key]).length;
  return Math.round((completed / habitKeys.length) * 100);
}

function isLogged(entry) {
  return Boolean(entry) && (habitKeys.some((key) => entry[key]) || entry.strength || entry.walks || entry.hiit || entry.golf || entry.weight);
}

function updateSummary(entries) {
  const weekDates = getWeekDates();
  const weekEntries = weekDates.map((date) => entries[formatDate(date)]).filter(Boolean);
  const strength = weekEntries.reduce((sum, entry) => sum + Number(entry.strength || 0), 0);
  const hiit = weekEntries.reduce((sum, entry) => sum + Number(entry.hiit || 0), 0);
  const weighIns = weekEntries.filter((entry) => entry.weight !== "" && entry.weight !== undefined).length;
  const loggedDays = weekEntries.filter(isLogged).length;
  const weeklyScore = Math.round(weekEntries.reduce((sum, entry) => sum + completionScore(entry), 0) / 7);

  document.querySelector("#strength-count").textContent = Math.min(strength, 2);
  document.querySelector("#hiit-count").textContent = Math.min(hiit, 1);
  document.querySelector("#weigh-count").textContent = Math.min(weighIns, 3);
  document.querySelector("#weekly-score").textContent = `${weeklyScore}%`;
  document.querySelector("#score-note").textContent = loggedDays
    ? `${loggedDays} of 7 days logged this week.`
    : "Log today to start your streak.";
  document.querySelector("#streak-count").textContent = getCurrentStreak(entries);
}

function getCurrentStreak(entries) {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = formatDate(cursor);
    if (!isLogged(entries[key])) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function renderWeek(entries) {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
  weekGrid.innerHTML = "";

  getWeekDates().forEach((date) => {
    const key = formatDate(date);
    const entry = entries[key];
    const card = document.createElement("article");
    card.className = "day-card";

    const pills = pillConfig
      .map(([habit, label]) => `<span class="pill ${entry?.[habit] ? "done" : ""}">${label}</span>`)
      .join("");

    card.innerHTML = `
      <div>
        <div class="day-name">${formatter.format(date)}</div>
        <small>${key}</small>
      </div>
      <div class="pill-row">${pills}</div>
      <div class="day-score">${completionScore(entry)}%</div>
    `;
    weekGrid.append(card);
  });
}

function render() {
  const entries = loadEntries();
  updateSummary(entries);
  renderWeek(entries);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = readForm();
  const entries = loadEntries();
  entries[entry.date] = entry;
  saveEntries(entries);
  render();
});

dateInput.addEventListener("change", () => {
  const entries = loadEntries();
  fillForm(entries[dateInput.value] ?? { date: dateInput.value });
});

clearButton.addEventListener("click", () => {
  const entries = loadEntries();
  delete entries[dateInput.value];
  saveEntries(entries);
  fillForm({ date: dateInput.value });
  render();
});

fillForm(loadEntries()[todayKey] ?? { date: todayKey });
render();
