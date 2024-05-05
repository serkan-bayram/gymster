// This function returns how many days are there in spefic month
export function daysInMonth(month, year) {
  return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
}
