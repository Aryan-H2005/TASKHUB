import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';
import { fetchTasks, deleteTask } from '../store/taskSlice';
import useDebounce from '../hooks/useDebounce';
import useUsers from '../hooks/useUsers';

export default function Tasks() {
  const dispatch = useDispatch();
  const users = useUsers();
  const { items, loading, error } = useSelector((s) => s.tasks);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('newest');
  const [modal, setModal] = useState(null); // null = closed, { task } = open
  const [actionError, setActionError] = useState('');

  const debouncedSearch = useDebounce(search, 400);
  const params = useMemo(
    () => ({ search: debouncedSearch, status, priority, sort }),
    [debouncedSearch, status, priority, sort]
  );

  const load = useCallback(() => dispatch(fetchTasks(params)), [dispatch, params]);
  useEffect(() => { load(); }, [load]);

  const handleEdit = useCallback((task) => setModal({ task }), []);
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setActionError('');
    const result = await dispatch(deleteTask(id));
    if (result.error) setActionError(result.payload);
  }, [dispatch]);

  const handleSaved = () => { setModal(null); load(); };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Tasks</h1>
          <p className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'task' : 'tasks'} shown</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ task: null })}>New task</button>
      </div>

      <div className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" placeholder="Search by title" aria-label="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="input" aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select className="input" aria-label="Sort by date" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest created</option>
          <option value="oldest">Oldest created</option>
          <option value="dueAsc">Due date: soonest</option>
          <option value="dueDesc">Due date: latest</option>
        </select>
      </div>

      {(error || actionError) && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error || actionError}</p>
      )}

      {loading ? <Spinner /> : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500">
          No tasks match. Clear the filters or create a new task.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((t) => <TaskCard key={t._id} task={t} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>
      )}

      {modal && <TaskForm task={modal.task} users={users} onClose={() => setModal(null)} onSaved={handleSaved} />}
    </div>
  );
}
