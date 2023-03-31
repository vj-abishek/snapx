export const generateExpiryDate = (expiresIn: string) => {
  if (expiresIn === "never") {
    return "never";
  }

  const currentDate = new Date();
  const currentTimestamp = currentDate.getTime();
  const date = new Date(currentTimestamp);

  switch (expiresIn) {
    case "1D":
      date.setDate(currentDate.getDate() + 1);
      break;
    case "2D":
      date.setDate(currentDate.getDate() + 2);
      break;
    case "5D":
      date.setDate(currentDate.getDate() + 5);
      break;
    case "1W":
      date.setDate(currentDate.getDate() + 7);
      break;
    case "1M":
      date.setDate(currentDate.getDate() + 30);
      break;
    case "3M":
      date.setDate(currentDate.getDate() + 90);
      break;
  }

  // convert date to timestamp
  const timestamp = date.getTime();
  return timestamp.toString();
};
