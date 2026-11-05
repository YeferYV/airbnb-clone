export function toDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayInput(): string {
  return toDateInput(new Date());
}

export function addDaysInput(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

export function dateInputToIso(value: string): string {
  return value ? `${value}T00:00:00.000Z` : '';
}

export function nightsBetween(start: string, end: string): number {
  if (!start || !end) {
    return 1;
  }

  const startTime = Date.UTC(
    Number(start.slice(0, 4)),
    Number(start.slice(5, 7)) - 1,
    Number(start.slice(8, 10)),
  );
  const endTime = Date.UTC(
    Number(end.slice(0, 4)),
    Number(end.slice(5, 7)) - 1,
    Number(end.slice(8, 10)),
  );

  return Math.max(1, Math.round((endTime - startTime) / 86_400_000));
}

export function formatRange(startIso: string, endIso: string): string {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${formatter.format(new Date(startIso))} - ${formatter.format(new Date(endIso))}`;
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}
