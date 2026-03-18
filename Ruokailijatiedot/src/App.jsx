import { useState, useEffect } from "react";
import DaySection from "./components/Days";
import WeekSummary from "./components/WeekSum";
import {
  getWeekTotal,
  getWeekFieldTotals
} from "./utils/calculations";

import "./App.css";

const days = ["Ma", "Ti", "Ke", "To", "Pe"];

const restaurants = {
  "Napostella": ["puuro", "lounas"],
  "Ilona": ["puuro", "lounas"],
  "Käenkaali": ["aamupala", "lounas buffet", "metsäeväät", "päivällinen"],
  "Kiito-Orava": ["puuro", "lounas"]
};

const months = [
  "Tammikuu","Helmikuu","Maaliskuu","Huhtikuu","Toukokuu","Kesäkuu",
  "Heinäkuu","Elokuu","Syyskuu","Lokakuu","Marraskuu","Joulukuu"
];

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

export default function App() {

  const [weekOffset, setWeekOffset] = useState(0);
  const [reports, setReports] = useState({});

  const today = new Date;
  today.setDate(today.getDate() + weekOffset * 7);

  const weekNumber = getWeekNumber(today);
  const year = today.getFullYear();
  const monthName = months[today.getMonth()];
  const weekKey = `${year}-W${weekNumber}`;

  const monday = new Date(today);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);

  const createEmptyWeek = () => {
    const data = {};
    days.forEach(day => {
      data[day] = {};
      Object.entries(restaurants).forEach(([restaurant, fields]) => {
        data[day][restaurant] = {};
        fields.forEach(field => {
          data[day][restaurant][field] = "";
        });
      });
    });
    return data;
  };

  const weekData = reports[weekKey] || createEmptyWeek();

  useEffect(() => {
    const saved = localStorage.getItem("annosraportit");
    if (saved) setReports(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("annosraportit", JSON.stringify(reports));
  }, [reports]);

  const updateValue = (day, restaurant, field, value) => {
    setReports(prev => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || createEmptyWeek()),
        [day]: {
          ...((prev[weekKey] || createEmptyWeek())[day]),
          [restaurant]: {
            ...((prev[weekKey] || createEmptyWeek())[day][restaurant]),
            [field]: value
          }
        }
      }
    }));
  };

  const fieldTotals = getWeekFieldTotals(weekData);

  return (
    <div className="app-container">

      <h1>Ruokailijatiedot</h1>

      <h2>
        Viikko {weekNumber} – {monthName} {year}
      </h2>

      <div className="week-buttons">
        <button onClick={() => setWeekOffset(weekOffset - 1)}>
          ← Edellinen
        </button>
        <button onClick={() => setWeekOffset(weekOffset + 1)}>
          Seuraava →
        </button>
      </div>

      <h3>Viikon yhteensä: <WeekSummary fieldTotals={fieldTotals} /></h3>

      <table>
        <tbody>
          {days.map((dayName, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateLabel = `${date.getDate()}.${date.getMonth()+1}.`;

            return (
              <DaySection
                key={dayName}
                dayName={dayName}
                dateLabel={dateLabel}
                restaurants={restaurants}
                weekData={weekData}
                updateValue={updateValue}
              />
            );
          })}
        </tbody>
      </table>

    </div>
  );
}