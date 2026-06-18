import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl
                     border shadow-lg animate-fade-in max-w-sm
                     ${isSuccess
                       ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                       : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
      {isSuccess
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle  className="w-4 h-4 flex-shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
