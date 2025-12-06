import { createContext, useContext, useState } from "react"


const AuthContext = createContext()

const decodeJWT = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(payload)
  } catch (error) {
    return null
  }
}


const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("token")
  const [token, setToken] = useState(savedToken || null)
  const [user, setUser] = useState(() => savedToken ? decodeJWT(savedToken) : null)
  const [isSessionExpired, setIsSessionExpired] = useState(false)

  const login = (token) => {
    setUser(decodeJWT(token))
    setToken(token)
    localStorage.setItem("token", token)
    setIsSessionExpired(false)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setIsSessionExpired(false)
  }

  // Verificar si el token ha expirado
  if (token && !isSessionExpired) {
    const decoded = decodeJWT(token)
    if (decoded && decoded.exp * 1000 < Date.now()) {
      setIsSessionExpired(true)
      localStorage.removeItem("token")
      setUser(null)
      setToken(null)
    }
  }

  const closeSessionExpiredModal = () => {
    setIsSessionExpired(false);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isSessionExpired, closeSessionExpiredModal }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)


export { useAuth, AuthProvider }