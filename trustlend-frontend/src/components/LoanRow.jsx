import React from 'react'

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
  BORROWED: 'bg-blue-100 text-blue-700',
  RETURNED: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-red-200 text-red-800',
}

export default function LoanRow({ loan, perspective, onAction }) {
  // perspective: 'lending' (I own the item) or 'borrowed' (I'm the borrower)
  const counterpartyName = perspective === 'lending' ? loan.borrowerName : loan.ownerName
  const counterpartyLabel = perspective === 'lending' ? 'Borrower' : 'Owner'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-gray-800">{loan.itemName}</p>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[loan.status]}`}>
          {loan.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        {counterpartyLabel}: <span className="font-medium">{counterpartyName}</span>
      </p>
      <p className="text-sm text-gray-500 mb-3">Due back: {loan.requestedDueDate}</p>

      <div className="flex items-center gap-2">
        {perspective === 'lending' && loan.status === 'PENDING' && (
          <>
            <ActionButton onClick={() => onAction(loan.id, 'approve')} label="Approve" color="brand" />
            <ActionButton onClick={() => onAction(loan.id, 'reject')} label="Reject" color="gray" />
          </>
        )}
        {(loan.status === 'BORROWED' || loan.status === 'OVERDUE') && (
          <ActionButton onClick={() => onAction(loan.id, 'return')} label="Mark as Returned" color="brand" />
        )}
      </div>
    </div>
  )
}

function ActionButton({ onClick, label, color }) {
  const cls = color === 'brand'
    ? 'bg-brand text-white hover:bg-brand-dark'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  return (
    <button onClick={onClick} className={`text-sm px-3 py-1.5 rounded-md ${cls}`}>
      {label}
    </button>
  )
}
