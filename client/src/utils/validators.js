export const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

export const hasMinLength = (value, min) => {
  return value && value.length >= min;
};
