export function getInitials(fullName) {
  const words = fullName.split(' ');

  // Extract the first letter from each word
  const initials = words.map(word => word.charAt(0).toUpperCase()).slice(0, 2);

  // Join the initials together
  return initials.join('');
}