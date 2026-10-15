import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api, { getErrorMessage } from '../services/api';
import { deleteTask } from '../store/taskSlice';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';
import useUsers from '../hooks/useUsers';
import { formatDate } from '../utils/format';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useUsers();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/tasks/${id}`)
      .then((res) => active && setTask(res.data))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    const result = await dispatch(deleteTask(id));
    if (result.error) setError(result.payload);
    else navigate('/tasks');
  };

  if (loading) return <Spinner />;

  if (!task) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="font-semibold text-ink">{error || 'Task not found'}</p>
        <Link to="/tasks" className="btn-primary mt-4">Back to tasks</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/tasks" className="text-sm font-semibold text-brand">Back to tasks</Link>
      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-ink">{task.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-slate-600">{task.description || 'No description provided.'}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Due date</dt><dd className="font-semibold">{formatDate(task.dueDate)}</dd></div>
          <div><dt className="text-slate-500">Assigned to</dt><dd className="font-semibold">{task.assignedUser?.name || 'Unassigned'}</dd></div>
          <div><dt className="text-slate-500">Created</dt><dd className="font-semibold">{formatDate(task.createdAt)}</dd></div>
          <div><dt className="text-slate-500">Last updated</dt><dd className="font-semibold">{formatDate(task.updatedAt)}</dd></div>
        </dl>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <div className="mt-6 flex gap-2">
          <button className="btn-primary" onClick={() => setEditing(true)}>Edit task</button>
          <button className="btn-danger" onClick={handleDelete}>Delete task</button>
        </div>
      </div>

      {editing && (
        <TaskForm task={task} users={users} onClose={() => setEditing(false)}
          onSaved={(saved) => { setTask(saved); setEditing(false); }} />
      )}
    </div>
  );
}
