export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <span className="text-xl font-extrabold">TeamTasks</span>
        <p className="max-w-sm text-3xl font-extrabold leading-tight">Know who is doing what, and what is due next.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
