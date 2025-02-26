export function generateRandomName(): { firstName: string; lastName: string } {
  const names = [
    'John',
    'Jane',
    'Chris',
    'Laura',
    'Mike',
    'Emma',
    'Robert',
    'Olivia',
    'James',
    'Sophia'
  ];
  const surnames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez'
  ];

  // Generate a random index for names and surnames
  const nameIndex = Math.floor(Math.random() * names.length);
  const middleNameIndex = Math.floor(Math.random() * names.length);
  const surnameIndex = Math.floor(Math.random() * surnames.length);
  const surname2Index = Math.floor(Math.random() * surnames.length);

  // Return the random name and surname
  return {
    firstName: `${names[nameIndex]} ${names[middleNameIndex]}`,
    lastName: `${surnames[surnameIndex]}-${surnames[surname2Index]}`
  };
}

export const randomName = generateRandomName();
