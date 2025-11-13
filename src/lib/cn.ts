// Utility: concatenates class name values while omitting falsy entries.
export function cn(
  ...values: Array<string | undefined | null | false>
): string {
  return values.filter(Boolean).join(" ");
}
