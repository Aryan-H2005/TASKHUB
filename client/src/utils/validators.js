export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const passwordError = (v) => {
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(v) || !/[A-Z]/.test(v)) return 'Password needs upper and lower case letters';
  if (!/\d/.test(v)) return 'Password needs at least one number';
  return '';
};
