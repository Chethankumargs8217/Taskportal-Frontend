import { CheckCircle2, Clock, Circle, BarChart3 } from 'lucide-react'

export default function StatsBar({ tasks }) {
  const total      = tasks.length
  const done       = tasks.filter((t) => t.status === 'DONE').length
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const todo       = tasks.filter((t) => t.status === 'TODO').length
  const pct        = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total',       value: total,      icon: BarChart3,    color: 'text-ink-400',    bg: 'bg-ink-800' },
        { label: 'To Do',       value: todo,       icon: Circle,       color: 'text-ink-300',    bg: 'bg-ink-800' },
        { label: 'In Progress', value: inProgress, icon: Clock,        color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { label: 'Done',        value: done,       icon: CheckCircle2, color: 'text-emerald-400',bg: 'bg-emerald-500/10' },
      ].map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="card p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-100 leading-none">{value}</p>
            <p className="text-xs text-ink-500 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
