import React, { useEffect, useState } from 'react'
import { getBorrowedLoans, getLendingLoans, approveLoan, rejectLoan, returnLoan } from '../api/loans'
import LoanRow from '../components/LoanRow'

export default function Loans() {
  const [tab, setTab] = useState('lending')
  const [lending, setLending] = useState([])
  const [borrowed, setBorrowed] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [l, b] = await Promise.all([getLendingLoans(), getBorrowedLoans()])
    setLending(l)
    setBorrowed(b)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAction = async (id, action) => {
    if (action === 'approve') await approveLoan(id)
    if (action === 'reject') await rejectLoan(id)
    if (action === 'return') await returnLoan(id)
    await load()
  }

  const list = tab === 'lending' ? lending : borrowed

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Loans</h1>

      <div className="flex gap-2 mb-6">
        <TabButton active={tab === 'lending'} onClick={() => setTab('lending')} label={`Items I'm Lending (${lending.length})`} />
        <TabButton active={tab === 'borrowed'} onClick={() => setTab('borrowed')} label={`Items I'm Borrowing (${borrowed.length})`} />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500 bg-white border border-gray-200 rounded-lg p-6 text-sm">
          Nothing here yet.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((loan) => (
            <LoanRow key={loan.id} loan={loan} perspective={tab} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium ${active ? 'bg-brand text-white' : 'bg-white border border-gray-300 text-gray-600'}`}
    >
      {label}
    </button>
  )
}
