import React, { useState, useEffect } from 'react'
import { aiAPI } from '../services/api'
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']
const BLANK = { title: '', description: '', priority: 'MEDIUM', dueDate: '', status: 'TODO' }

// ── Sanitize AI text so it never breaks JSON or backend validation ─────────────
// Gemini returns markdown with newlines, asterisks, quotes, bullet points etc.
// We strip markdown symbols and collapse whitespace into clean plain text.
function sanitizeAIText(raw) {
  return raw
    .replace(/\*\*/g, '')          // remove bold **
    .replace(/\*/g, '')            // remove italic *
    .replace(/#{1,6}\s/g, '')      // remove headings #, ##, ###
    .replace(/`{1,3}/g, '')        // remove code backticks
    .replace(/\r\n/g, ' ')         // Windows line endings → space
    .replace(/\n/g, ' ')           // Unix line endings → space
    .replace(/\r/g, ' ')           // carriage returns → space
    .replace(/\t/g, ' ')           // tabs → space
    .replace(/\s{2,}/g, ' ')       // collapse multiple spaces
    .replace(/["""]/g, "'")        // curly/smart quotes → plain apostrophe (avoids JSON breaking)
    .trim()
    .substring(0, 1000)            // cap at 1000 chars (backend column is 2000)
}

export default function TaskModal({ task, onSave, onClose }) {
  const isEdit = !!task

  const [form, setForm] = useState(isEdit ? {
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    dueDate: task.dueDate ?? '',
    status: task.status,
  } : { ...BLANK })

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.dueDate) errs.dueDate = 'Due date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const generateAI = async () => {
    if (!form.title.trim()) { setAiError('Enter a title first.'); return }
    setAiLoading(true)
    setAiError('')
    try {
      const { data } = await aiAPI.generate(form.title)

      // data is a plain string returned by Spring's @GetMapping
      const raw = typeof data === 'string' ? data : JSON.stringify(data)

      // ✅ Sanitize before putting into form — removes all chars that break JSON
      const description = sanitizeAIText(raw)

      // Try to detect priority hint in the AI text
      let priority = form.priority
      const priorityMatch = raw.match(/\bPriority[:\s]+(HIGH|MEDIUM|LOW)\b/i)
      if (priorityMatch) priority = priorityMatch[1].toUpperCase()

      setForm((f) => ({ ...f, description, priority }))
    } catch (err) {
      console.error('AI generate error:', err)
      setAiError('AI generation failed. You can write the description manually.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await onSave(form, task?.id)
    setSaving(false)
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-ink-800">
          <h2 className="font-semibold text-ink-100">{isEdit ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-300 hover:bg-ink-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="label">Title</label>
            <input type="text" placeholder="e.g. Prepare client presentation"
              value={form.title} onChange={set('title')}
              className={`input ${errors.title ? 'border-rose-500' : ''}`} />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Description + AI */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Description</label>
              <button type="button" onClick={generateAI} disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300
                           bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20
                           px-2.5 py-1 rounded-lg transition-all disabled:opacity-50">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {aiLoading ? 'Generating…' : 'AI Generate'}
              </button>
            </div>
            {aiError && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10
                              border border-amber-500/20 rounded-lg px-3 py-2 mb-2">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />{aiError}
              </div>
            )}
            <textarea rows={4} placeholder="Describe the task in detail…"
              value={form.description} onChange={set('description')}
              className={`input resize-none leading-relaxed ${errors.description ? 'border-rose-500' : ''}`} />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select value={form.priority} onChange={set('priority')} className="input">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" value={form.dueDate} onChange={set('dueDate')}
                className={`input ${errors.dueDate ? 'border-rose-500' : ''}`} />
              {errors.dueDate && <p className="text-xs text-rose-400 mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={set('status')} className="input">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {{ TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[s]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-ink-800">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </div>
  )
}
