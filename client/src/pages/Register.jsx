import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { registerUser, clearError } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import { isEmail, passwordError } from '../utils/validators';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  if (isAuthenticated) return <Navigate to="/" replace />;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!isEmail(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (passwordError(form.password)) errs.password = passwordError(form.password);
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const { name, email, password } = form;
    const result = await dispatch(registerUser({ name, email, password }));
    if (!result.error) navigate('/');
  };

  const fields = [
    ['name', 'Full name', 'text'],
    ['email', 'Email', 'email'],
    ['password', 'Password', 'password'],
    ['confirm', 'Confirm password', 'password'],
  ];

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {fields.map(([name, label, type]) => (
          <div key={name}>
            <label className="label" htmlFor={name}>{label}</label>
            <input id={name} name={name} type={type} className="input" value={form[name]} onChange={change} />
            {errors[name] && <p className="field-error">{errors[name]}</p>}
          </div>
        ))}
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already registered? <Link to="/login" className="font-semibold text-brand">Log in</Link>
      </p>
    </AuthShell>
  );
}
