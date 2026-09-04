import React, { useEffect, useState } from 'react'
import { browseItems } from '../api/items'
import { requestLoan } from '../api/loans'
import ItemCard from '../components/ItemCard'

export default function Browse() {
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const load = async (cat) => {
    setLoading(true)
    const data = await browseItems(cat)
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    load(category)
  }

  const handleRequestLoan = async (item, dueDate) => {
    try {
      await requestLoan({ itemId: item.id, requestedDueDate: dueDate })
      setToast(`Request sent for "${item.name}"!`)
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      setToast(err.response?.data?.message || 'Could not send request.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-1">Browse Items</h1>
      <p className="text-gray-500 mb-6">Things your neighbors are willing to lend.</p>

      {toast && <p className="bg-brand/10 text-brand text-sm rounded-md p-2 mb-4">{toast}</p>}

      <form onSubmit={handleFilter} className="flex gap-2 mb-6">
        <input
          placeholder="Filter by category (e.g. Tools)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
        />
        <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
          Filter
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 bg-white border border-gray-200 rounded-lg p-6 text-sm">
          No items available right now.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onRequestLoan={handleRequestLoan} />
          ))}
        </div>
      )}
    </div>
  )
}
