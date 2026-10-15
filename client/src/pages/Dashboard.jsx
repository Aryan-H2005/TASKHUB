import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import { StatusBadge } from '../components/Badge';
import { fetchTasks } from '../store/taskSlice';
import { formatDate } from '../utils/format';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, loading, error } = useSelector((s) => s.tasks);

  useEffect(() => { dispatch(fetchTasks({})); }, [dispatch]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((t) => t.status === 'pending').length,
    progress: items.filter((t) => t.status === 'in-progress').length,
    completed: items.filter((t) => t.status === 'completed').length,
  }), [items]);

  const recent = useMemo(() => items.slice(0, 5), [items]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Hello, {user?.name?.split(' ')[0]}</h1>
      <p className="mb-6 text-sm text-slate-500">Here is where your team's work stands today.</p>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} color="border-ink" />
        <StatCard label="Pending" value={stats.pending} color="border-slate-400" />
        <StatCard label="In progress" value={stats.progress} color="border-amber-500" />
        <StatCard label="Completed" value={stats.completed} color="border-emerald-500" />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Recent tasks</h2>
          <Link to="/tasks" className="text-sm font-semibold text-brand">View all</Link>
        </div>
        {loading ? <Spinner /> : recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No tasks yet. Create your first one from the Tasks page.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((t) => (
              <li key={t._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <Link to={`/tasks/${t._id}`} className="font-semibold text-ink hover:text-brand">{t.title}</Link>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{formatDate(t.dueDate)}</span>
                  <StatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
