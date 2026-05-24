import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    setUser({ id: '1', name: 'Ana & Pedro', email, avatar: null })
    return Promise.resolve()
  }

  const loginWithGoogle = () => {
    setUser({ id: '1', name: 'Ana & Pedro', email: 'ana.pedro@email.com', avatar: null })
    return Promise.resolve()
  }

  const register = (name, email, password) => {
    setUser({ id: '1', name, email, avatar: null })
    return Promise.resolve()
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
