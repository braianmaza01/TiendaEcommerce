import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AdminAuthContext = createContext()

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem('urbx_admin_token')
  )

  async function login(usuario, contrasena) {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      usuario,
      contrasena,
    })
    localStorage.setItem('urbx_admin_token', res.data.token)
    setToken(res.data.token)
  }

  function logout() {
    localStorage.removeItem('urbx_admin_token')
    setToken(null)
  }

  const value = { token, isAuthenticated: Boolean(token), login, logout }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
