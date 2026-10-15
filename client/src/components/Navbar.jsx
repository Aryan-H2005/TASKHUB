import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import useAuth from '../hooks/useAuth';

export default function Navbar({ onMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <button className="btn-ghost lg:hidden" onClick={onMenu} aria-label="Open menu">Menu</button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-bold text-ink">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
        <button className="btn-ghost" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}
