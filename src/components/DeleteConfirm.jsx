import React from 'react'
import{ Trash2, X } from 'lucide-react'

export default function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm">
      <div className="card w-full max-w-sm p-6 animate-fade-in text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-rose-400" />
        </div>
        <h3 className="font-semibold text-ink-100 mb-2">Delete this task?</h3>
        <p className="text-sm text-ink-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger flex-1 justify-center">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
