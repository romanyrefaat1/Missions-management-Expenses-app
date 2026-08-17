export const formatSupabaseTimestamp = (
  timestamp: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
  returnElse: string = "N/A"
): string => {
  if (!timestamp) {
    return returnElse;
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return returnElse;
  }

  return date.toLocaleString("en-US", options);
};