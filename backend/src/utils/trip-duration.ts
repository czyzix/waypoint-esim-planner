const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const MAX_RECOMMENDATION_DAYS = 30;

export function computeTripDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}
