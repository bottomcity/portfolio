export function generateRandomEmail() {
  const validChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let email = '';

  // Generate a random string for the local part of the email
  for (let i = 0; i < 10; i++) {
    email += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }

  email += '@example.com';

  return email;
}

export const randomEmail = generateRandomEmail();
