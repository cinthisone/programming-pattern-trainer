function toUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toUtcDateString(date);
}

export function computeStreak(input: {
  passingSubmitDaysUtc: string[];
  todayUtc: string;
}): number {
  const days = new Set(input.passingSubmitDaysUtc);
  if (!days.has(input.todayUtc)) {
    return 0;
  }

  let streak = 0;
  let cursor = input.todayUtc;
  while (days.has(cursor)) {
    streak += 1;
    cursor = addUtcDays(cursor, -1);
  }
  return streak;
}
