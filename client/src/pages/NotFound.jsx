import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-6xl font-extrabold text-ink">404</p>
      <p className="text-slate-500">This page does not exist.</p>
      <Link to="/" className="btn-primary">Go to dashboard</Link>
    </div>
  );
}
