export const generateCVV = (): string => {
  return (Math.floor(Math.random() * 900) + 100).toString();
};
export const generateCardNumber = (): string => {
  const num = Math.floor(Math.random() * 900000000000) + 100000000000;
  return num.toString();
};
export const generateDateThreeYearsLater = (): Date => {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 3);
  return currentDate;
};
