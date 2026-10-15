export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date';

export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export const STATUS_LABEL = { pending: 'Pending', 'in-progress': 'In progress', completed: 'Completed' };
