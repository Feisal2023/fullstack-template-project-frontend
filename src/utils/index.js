export const shortenText = (text, n) => {
  if (text.length > n) {
    const shortenedText = text.substring(0, n).concat("...");
    return shortenedText;
  }
  return text;
};

export const countUserRole = (userRole, users) => {
  const array = [];
  users.map((user) => {
    const { role } = user;
    return array.push(role);
  });
  let count = 0;
  array.forEach((item) => {
    if (item === userRole) {
      count += 1;
    }
  });
  return count;
};
