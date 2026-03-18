import RestaurantRow from "./RestaurantRow";

export default function DaySection({
  dayName,
  dateLabel,
  restaurants,
  weekData,
  updateValue
}) {
  return (
    <>
      <tr className="day-header">
        <td colSpan="4">
          {dayName} {dateLabel}
        </td>
      </tr>

      {Object.entries(restaurants).map(([restaurant, fields]) => (
        <RestaurantRow
          key={restaurant}
          dayName={dayName}
          restaurant={restaurant}
          fields={fields}
          values={weekData?.[dayName]?.[restaurant] || {}}
          updateValue={updateValue}
        />
      ))}
    </>
  );
}