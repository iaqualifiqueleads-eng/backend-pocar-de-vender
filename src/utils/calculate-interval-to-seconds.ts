
export function calculateIntervalToSeconds(date1: Date, date2: Date) {
  try {
    const seconds = Math.floor((new Date(date2).getTime() - new Date(date1).getTime()) / 1000);
    return seconds;
  } catch (error) {
    return 0;
  }
}