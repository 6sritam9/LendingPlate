import React, { useState } from 'react'

export default function ItemCard({ item, onRequestLoan, onDelete, showOwner = true }) {
  const [dueDate, setDueDate] = useState('')

  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-800">{item.name}</p>
          {item.category && <p className="text-xs text-gray-500">{item.category}</p>}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.available ? 'Available' : 'On loan'}
        </span>
      </div>

      {item.description && <p className="text-sm text-gray-600 mb-3">{item.description}</p>}

      {showOwner && (
        <p className="text-xs text-gray-400 mb-3">
          Owned by {item.ownerName}{item.ownerNeighborhood ? ` · ${item.ownerNeighborhood}` : ''}
        </p>
      )}

      {onRequestLoan && item.available && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <input
            type="date"
            min={minDate}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
          />
          <button
            disabled={!dueDate}
            onClick={() => onRequestLoan(item, dueDate)}
            className="bg-brand text-white text-sm px-3 py-1.5 rounded-md hover:bg-brand-dark disabled:opacity-50"
          >
            Request to Borrow
          </button>
        </div>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          className="text-xs text-red-500 hover:underline mt-2"
        >
          Remove listing
        </button>
      )}
    </div>
  )
}
