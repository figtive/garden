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

export function formatDate(date: string, { short = false } = {}) {
  const [year, month, day] = date.split("-");
  const label = `${day} ${months[Number(month) - 1]}`;

  if (short && Number(year) === new Date().getFullYear()) {
    return label;
  }
  return `${label} ${year}`;
}
