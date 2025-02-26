// Create a new Date object representing the current date and time
const today = new Date();

// Calculate the birthdate for someone who is at least 21 years old
const birthdate = new Date(today);
birthdate.setFullYear(today.getFullYear() - 21); // Subtract 21 years from the current year

// Get the year, month, and day components of the birthdate
const birthYear = birthdate.getFullYear();
const birthMonth = birthdate.getMonth() + 1; // Note: getMonth() returns a zero-based index, so add 1 to get the actual month
const birthDay = birthdate.getDate();

// Calculate the day after the birthdate
const nextDay = new Date(birthdate);
nextDay.setDate(nextDay.getDate() + 1);

// Get the year, month, and day components of the next day
const nextYear = nextDay.getFullYear();
const nextMonth = nextDay.getMonth() + 1; // Note: getMonth() returns a zero-based index, so add 1 to get the actual month
const nextDayOfMonth = nextDay.getDate();

// Calculate the day before the birthdate
const previousDay = new Date(birthdate);
previousDay.setDate(previousDay.getDate() - 1);

// Get the year, month, and day components of the previous day
const previousYear = previousDay.getFullYear();
const previousMonth = previousDay.getMonth() + 1; // Note: getMonth() returns a zero-based index, so add 1 to get the actual month
const previousDayOfMonth = previousDay.getDate();

// Format the birthdate components as a string in DD/MM/YYYY format
export const formattedBirthdateBasedOnTodayDate = `${
  birthDay < 10 ? '0' + birthDay : birthDay
}/${birthMonth < 10 ? '0' + birthMonth : birthMonth}/${birthYear}`;

export const formattedDayAfterBirthdateBasedOnTodayDate = `${
  nextDayOfMonth < 10 ? '0' + nextDayOfMonth : nextDayOfMonth
}/${nextMonth < 10 ? '0' + nextMonth : nextMonth}/${nextYear}`;

// Format the birthdate components as a string in DD/MM/YYYY format
export const formattedDayBeforeBirthdateBasedOnTodayDate = `${
  previousDayOfMonth < 10 ? '0' + previousDayOfMonth : previousDayOfMonth
}/${previousMonth < 10 ? '0' + previousMonth : previousMonth}/${previousYear}`;

export const getDateForMaintenanceRequest = () => {
  let time, startDate, endDate;
  time = new Date();
  time.setSeconds(time.getSeconds() + 2);
  startDate = time.toISOString();
  time.setSeconds(time.getSeconds() + 300);
  endDate = time.toISOString();
  return {
    startDate: startDate,
    endDate: endDate
  };
};
