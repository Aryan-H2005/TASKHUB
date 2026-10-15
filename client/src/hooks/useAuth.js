import { useSelector } from 'react-redux';

export default function useAuth() {
  const { user, token } = useSelector((s) => s.auth);
  return { user, token, isAuthenticated: !!token };
}
