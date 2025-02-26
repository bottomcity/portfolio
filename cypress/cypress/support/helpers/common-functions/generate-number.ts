export function generateRandomNumber() {
  const min = 10000000; // Minimum number with 8 digits
  const max = 99999999; // Maximum number with 8 digits
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return '9' + randomNumber; // Concatenate '9' to the beginning
}

export const randomNumber = generateRandomNumber();
