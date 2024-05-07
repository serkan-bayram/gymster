// This function returns how many days are there in spefic month
export function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}
