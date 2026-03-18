import { getRowTotal } from "../utils/calculations";

export default function RestaurantRow({
  dayName,
  restaurant,
  fields,
  values,
  updateValue
}) {
  return (
    <tr className="restaurant-row">
      <td></td>

      <td className="restaurant-name">{restaurant}</td>

      <td>
        {fields.map(field => (
          <div key={field} className="field-row">
            <span>{field}</span>

            <input
              type="number"
              value={values[field] || ""}
              onChange={(e) =>
                updateValue(dayName, restaurant, field, e.target.value)
              }
              className={values[field] ? "filled" : ""}
            />
          </div>
        ))}
      </td>

      <td className="total-cell">
        {getRowTotal(values)}
      </td>
    </tr>
  );
}