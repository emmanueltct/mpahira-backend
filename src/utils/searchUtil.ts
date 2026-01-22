export const getStringQuery = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};