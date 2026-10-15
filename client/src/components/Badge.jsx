import { memo } from 'react';
import { STATUS_LABEL } from '../utils/format';

const STATUS = {
  pending: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
};
const PRIORITY = {
  low: 'bg-sky-100 text-sky-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-700',
};
const base = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold';

export const StatusBadge = memo(({ status }) => (
  <span className={`${base} ${STATUS[status]}`}>{STATUS_LABEL[status]}</span>
));

export const PriorityBadge = memo(({ priority }) => (
  <span className={`${base} capitalize ${PRIORITY[priority]}`}>{priority} priority</span>
));
