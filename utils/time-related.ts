function getWeekStartAndEnd(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  const end = new Date(date);

  const day = start.getUTCDay(); // Get the day of the week (0 - Sunday, 6 - Saturday)

  // Calculate the start of the week (Sunday)
  start.setUTCDate(start.getUTCDate() - day);
  start.setUTCHours(0, 0, 0, 0);

  // Calculate the end of the week (Saturday)
  end.setUTCDate(end.getUTCDate() + (6 - day));
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}

export function isDateInSameWeek(date: string, referenceDate: string): boolean {
  const refDate = new Date(referenceDate);
  const { start, end } = getWeekStartAndEnd(refDate);

  const currentDate = new Date(date);
  return currentDate >= start && currentDate <= end;
}

export function isDateInSameMonth(
  date: string,
  referenceDate: string
): boolean {
  const refDate = new Date(referenceDate);
  const currentDate = new Date(date);

  return (
    refDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
    refDate.getUTCMonth() === currentDate.getUTCMonth()
  );
}

export function isDateInSameYear(date: string, referenceDate: string): boolean {
  const refDate = new Date(referenceDate);
  const currentDate = new Date(date);

  return refDate.getUTCFullYear() === currentDate.getUTCFullYear();
}
