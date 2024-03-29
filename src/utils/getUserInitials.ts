export const getUserInitials = (name: string) => {
  if (name === '') {
    return '';
  }
  const [firstName, lastName] = name.split(' ');
  if (lastName !== undefined) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  } else {
    return firstName[0].toUpperCase();
  }
};
