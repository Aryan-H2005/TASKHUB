import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { loginUser, clearError } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import { isEmail } from '../utils/validators';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  if (isAuthenticated) return <Navigate to="/" replace />;

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!isEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const result = await dispatch(loginUser(form));
    if (!result.error) navigate('/');
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your team's tasks.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" value={form.email} onChange={change} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="input" value={form.password} onChange={change} />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={change} /> Remember me
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        New here? <Link to="/register" className="font-semibold text-brand">Create an account</Link>
      </p>
    </AuthShell>
  );
}
