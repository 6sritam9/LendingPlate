import api from './axiosInstance'

export const requestLoan = (payload) => api.post('/loans', payload).then(r => r.data)
export const getBorrowedLoans = () => api.get('/loans/borrowed').then(r => r.data)
export const getLendingLoans = () => api.get('/loans/lending').then(r => r.data)
export const approveLoan = (id) => api.patch(`/loans/${id}/approve`).then(r => r.data)
export const rejectLoan = (id) => api.patch(`/loans/${id}/reject`).then(r => r.data)
export const returnLoan = (id) => api.patch(`/loans/${id}/return`).then(r => r.data)
