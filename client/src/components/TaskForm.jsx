import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../store/taskSlice';
import useAuth from '../hooks/useAuth';
import { toInputDate } from '../utils/format';

export default function TaskForm({ task, users, onClose, onSaved }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    dueDate: toInputDate(task?.dueDate),
    assignedUser: task?.assignedUser?._id || user?.id || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    setSaving(true);
    setError('');
    const result = await dispatch(task ? updateTask({ id: task._id, ...form }) : createTask(form));
    setSaving(false);
    if (result.error) return setError(result.payload || 'Could not save task');
    onSaved(result.payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} noValidate className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-ink">{task ? 'Edit task' : 'New task'}</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" name="title" className="input" value={form.title} onChange={change} maxLength={100} />
          </div>
          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={3} className="input" value={form.description} onChange={change} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="priority">Priority</label>
              <select id="priority" name="priority" className="input" value={form.priority} onChange={change}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" className="input" value={form.status} onChange={change}>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="dueDate">Due date</label>
              <input id="dueDate" name="dueDate" type="date" className="input" value={form.dueDate} onChange={change} />
            </div>
            <div>
              <label className="label" htmlFor="assignedUser">Assigned user</label>
              <select id="assignedUser" name="assignedUser" className="input" value={form.assignedUser} onChange={change}>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  );
}
