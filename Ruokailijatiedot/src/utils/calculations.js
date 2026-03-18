export const getRowTotal = (fields) => {
  return Object.values(fields)
    .reduce((a, b) => a + (Number(b) || 0), 0);
};

export const getDayTotal = (dayData) => {
  return Object.values(dayData)
    .reduce((sum, restaurant) => sum + getRowTotal(restaurant), 0);
};

export const getWeekTotal = (weekData) => {
  return Object.values(weekData)
    .reduce((sum, day) => sum + getDayTotal(day), 0);
};

export const getWeekFieldTotals = (weekData) => {
  const totals = {};

  Object.values(weekData).forEach(day => {
    Object.values(day).forEach(restaurant => {
      Object.entries(restaurant).forEach(([field, value]) => {
        totals[field] = (totals[field] || 0) + (Number(value) || 0);
      });
    });
  });

  return totals;
};