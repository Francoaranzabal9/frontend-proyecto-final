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

  const login = (token) => {
    setUser(decodeJWT(token))
    setToken(token)
    localStorage.setItem("token", token)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)


export { useAuth, AuthProvider }