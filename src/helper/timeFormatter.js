export function formatTimeString(timeString) {
  const currentDate = new Date();
  const inputDate = new Date(timeString);

  // Check if it's the same day
  if (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    currentDate.getDate() === inputDate.getDate()
  ) {
    // Return time in HH:MM format if it's the same day
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    currentDate.getDate() - inputDate.getDate() < 7
  ) {
    // Return day of the week if it's the same week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[inputDate.getDay()];
    return dayOfWeek;
  } else {
    // Return date with DD/MM/YYYY format for different days
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export function getTimeString(timeString) {
  const inputDate = new Date(timeString);
  const hours = inputDate.getHours().toString().padStart(2, '0');
  const minutes = inputDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatChatDateString(dateString) {
  const now = new Date();
  const date = new Date(dateString);

  // Check if the date is today
  if (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  ) {
    return "Today";
  }

  // Check if the date is more than 1 week ago
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date < oneWeekAgo) {
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }

  // Return the day of the week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[date.getDay()];
}