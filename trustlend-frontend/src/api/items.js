import api from './axiosInstance'

export const browseItems = (category) =>
  api.get('/items', { params: category ? { category } : {} }).then(r => r.data)

export const createItem = (payload) => api.post('/items', payload).then(r => r.data)

export const getMyItems = () => api.get('/items/mine').then(r => r.data)

export const deleteItem = (id) => api.delete(`/items/${id}`)
