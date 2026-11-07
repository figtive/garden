const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export function formatDate(
  date: string,
  { short = false, year: withYear = true } = {},
) {
  const [year, month, day] = date.split("-");
  const monthName = months[Number(month) - 1];
  const label = `${day} ${monthName}`;

  if (!withYear || (short && Number(year) === new Date().getFullYear())) {
    return label;
  }
  if (short) {
    return `${label} ’${year?.slice(2)}`;
  }
  return `${label} ${year}`;
}
