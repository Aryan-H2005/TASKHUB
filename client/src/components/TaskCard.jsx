import { memo } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './Badge';
import { formatDate } from '../utils/format';

// React.memo: only re-renders when its own task changes
const TaskCard = memo(function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      <h3 className="mt-3 text-lg font-bold text-ink">{task.title}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-600">{task.description || 'No description'}</p>
      <dl className="mt-4 space-y-1 text-sm text-slate-500">
        <div className="flex justify-between"><dt>Due</dt><dd className="font-medium text-slate-700">{formatDate(task.dueDate)}</dd></div>
        <div className="flex justify-between"><dt>Assigned to</dt><dd className="font-medium text-slate-700">{task.assignedUser?.name || 'Unassigned'}</dd></div>
      </dl>
      <div className="mt-4 flex gap-2">
        <Link to={`/tasks/${task._id}`} className="btn-ghost flex-1">View</Link>
        <button className="btn-ghost flex-1" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </article>
  );
});

export default TaskCard;
