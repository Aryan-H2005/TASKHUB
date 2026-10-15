import { memo } from 'react';

const StatCard = memo(function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl border-l-4 bg-white p-5 shadow-sm ${color}`}>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-extrabold text-ink">{value}</p>
    </div>
  );
});

export default StatCard;
