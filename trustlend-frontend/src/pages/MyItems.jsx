import React, { useEffect, useState } from 'react'
import { getMyItems, createItem, deleteItem } from '../api/items'
import ItemCard from '../components/ItemCard'

export default function MyItems() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '', category: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await getMyItems()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createItem(form)
      setForm({ name: '', description: '', category: '' })
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add item.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove item.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Items</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-4">List a new item</h2>
        {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2 mb-4">{error}</p>}

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            placeholder="Item name (e.g. Power drill)"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2"
          />
          <input
            placeholder="Category (e.g. Tools)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <textarea
            placeholder="Short description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 md:col-span-3"
            rows={2}
          />
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-3 bg-brand text-white py-2 rounded-md hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? 'Adding…' : 'Add Item'}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 bg-white border border-gray-200 rounded-lg p-6 text-sm">
          You haven't listed anything yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={handleDelete} showOwner={false} />
          ))}
        </div>
      )}
    </div>
  )
}
