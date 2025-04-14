export function makeInputDateFromString(dateString: string) {
  const date = new Date(dateString);
  return makeInputDate(date);
}

export function makeInputDate(date: Date) {
  const day = ("0" + date.getDate()).slice(-2); // adds zero, takes the last 2 (because 031)
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  return date.getFullYear() + "-" + month + "-" + day;
}

export function formatDateFromString(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
