// "Remember me" -> localStorage (persists). Otherwise sessionStorage (cleared when tab closes).
const read = (store) => {
  const token = store.getItem('token');
  const user = store.getItem('user');
  return token && user ? { token, user: JSON.parse(user) } : null;
};

export const loadAuth = () => read(localStorage) || read(sessionStorage) || { token: null, user: null };
export const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

export const saveAuth = ({ token, user }, remember) => {
  clearAuth();
  const store = remember ? localStorage : sessionStorage;
  store.setItem('token', token);
  store.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  ['token', 'user'].forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
};
