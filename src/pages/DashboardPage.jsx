import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { taskAPI } from '../services/api'
import Navbar        from '../components/Navbar'
import StatsBar      from '../components/StatsBar'
import TaskCard      from '../components/TaskCard'
import TaskModal     from '../components/TaskModal'
import DeleteConfirm from '../components/DeleteConfirm'
import Toast         from '../components/Toast'
import { Plus, Search, SlidersHorizontal, Inbox, Loader2 } from 'lucide-react'

const STATUS_COLS = [
  { key: 'TODO',        label: 'To Do',       dot: 'bg-ink-600' },
  { key: 'IN_PROGRESS', label: 'In Progress',  dot: 'bg-violet-500' },
  { key: 'DONE',        label: 'Done',         dot: 'bg-emerald-500' },
]

export default function DashboardPage() {
  const [tasks,          setTasks]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [search,         setSearch]         = useState('')
  const [filterStatus,   setFilterStatus]   = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [showModal,      setShowModal]      = useState(false)
  const [editingTask,    setEditingTask]    = useState(null)
  const [deleteId,       setDeleteId]       = useState(null)
  const [toast,          setToast]          = useState(null)

  const notify = (message, type = 'success') => setToast({ message, type })

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await taskAPI.getAll()
      setTasks(Array.isArray(data) ? data : [])
    } catch {
      notify('Failed to load tasks', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleSave = async (form, id) => {
    try {
      if (id) {
        const { data } = await taskAPI.update(id, {
          title:       form.title,
          description: form.description,
          priority:    form.priority,
          status:      form.status,
          dueDate:     form.dueDate,   // ← now sent on update too
        })
        setTasks((ts) => ts.map((t) => t.id === id ? data : t))
        notify('Task updated')
      } else {
        const { data } = await taskAPI.create({
          title:       form.title,
          description: form.description,
          priority:    form.priority,
          dueDate:     form.dueDate,
        })
        setTasks((ts) => [data, ...ts])
        notify('Task created')
      }
      setShowModal(false)
      setEditingTask(null)
    } catch (err) {
      const errData = err.response?.data
      const msg = typeof errData === 'object'
        ? Object.values(errData).join(', ')
        : errData ?? 'Something went wrong'
      notify(msg, 'error')
    }
  }

  const confirmDelete = async () => {
    try {
      await taskAPI.delete(deleteId)
      setTasks((ts) => ts.filter((t) => t.id !== deleteId))
      notify('Task deleted')
    } catch {
      notify('Delete failed', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      const { data } = await taskAPI.update(task.id, {
        title:       task.title,
        description: task.description,
        priority:    task.priority,
        status:      newStatus,
        dueDate:     task.dueDate,   // ← include dueDate so backend validation passes
      })
      setTasks((ts) => ts.map((t) => t.id === task.id ? data : t))
      notify('Status updated')
    } catch {
      notify('Update failed', 'error')
    }
  }

  const filtered = tasks.filter((t) => {
    const matchSearch   = !search || t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus   = filterStatus   === 'ALL' || t.status   === filterStatus
    const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  const tasksByStatus = (status) => filtered.filter((t) => t.status === status)

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-50">My Tasks</h1>
            <p className="text-sm text-ink-500 mt-0.5">Manage, track, and automate your work</p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setShowModal(true) }}
            className="btn-primary sm:self-start"
          >
            <Plus className="w-4 h-4" /> New task
          </button>
        </div>

        <StatsBar tasks={tasks} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="text" placeholder="Search tasks…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-ink-500 shrink-0" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-auto">
              <option value="ALL">All statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="input w-auto">
              <option value="ALL">All priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUS_COLS.map(({ key, label, dot }) => {
              const col = tasksByStatus(key)
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className="text-sm font-medium text-ink-300">{label}</span>
                    <span className="ml-auto text-xs font-mono text-ink-600">{col.length}</span>
                  </div>
                  {col.length === 0 ? (
                    <div className="card border-dashed border-ink-800 py-10 flex flex-col
                                    items-center justify-center text-ink-700 gap-2">
                      <Inbox className="w-6 h-6" />
                      <p className="text-xs">No tasks here</p>
                    </div>
                  ) : (
                    col.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => { setEditingTask(t); setShowModal(true) }}
                        onDelete={(id) => setDeleteId(id)}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTask(null) }}
        />
      )}
      {deleteId && (
        <DeleteConfirm onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
