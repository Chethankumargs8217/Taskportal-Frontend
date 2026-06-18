import React from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2, Calendar, Clock4, ChevronRight } from 'lucide-react'

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }
const STATUS_CLASS = { TODO: 'badge-todo', IN_PROGRESS: 'badge-in-progress', DONE: 'badge-done' }
const PRIORITY_CLASS = { HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' }

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const nextStatus = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: null }[task.status]

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try { return format(new Date(dateStr), 'MMM d, yyyy') } catch { return null }
  }

  return (
    <div className="card p-5 group hover:border-ink-700 transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-ink-100 leading-snug flex-1">{task.title}</h3>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-ink-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="Edit">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-ink-400 leading-relaxed mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={STATUS_CLASS[task.status]}>{STATUS_LABELS[task.status]}</span>
        <span className={PRIORITY_CLASS[task.priority]}>{task.priority}</span>
      </div>

      {/* Due date + Created at */}
      <div className="flex flex-col gap-1 mb-4">
        {task.dueDate && (
          <span className="flex items-center gap-1.5 text-xs text-ink-500">
            <Calendar className="w-3 h-3 text-ink-600" />
            Due: {formatDate(task.dueDate)}
          </span>
        )}
        {task.createdAt && (
          <span className="flex items-center gap-1.5 text-xs text-ink-600">
            <Clock4 className="w-3 h-3" />
            Created: {formatDate(task.createdAt)}
          </span>
        )}
      </div>

      {nextStatus && (
        <button
          onClick={() => onStatusChange(task, nextStatus)}
          className="w-full text-xs text-ink-500 hover:text-violet-400 border border-ink-700
                     hover:border-violet-500/40 rounded-xl py-2 transition-all flex items-center justify-center gap-1"
        >
          Move to {STATUS_LABELS[nextStatus]}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
