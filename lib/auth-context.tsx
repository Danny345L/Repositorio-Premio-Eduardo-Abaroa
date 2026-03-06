"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { type User } from "./types"
import { MOCK_USERS } from "./mock-data"

interface AuthContextType {
  user: User | null
  users: User[]
  login: (email: string, password: string) => boolean
  logout: () => void
  registerUser: (user: User) => void
  removeUser: (userId: string) => void
  updateUser: (user: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((email: string, password: string) => {
    setIsLoading(true)
    const found = users.find((u) => u.email === email)
    if (found) {
      // For demo: accept if password matches or if no password is set (legacy mock)
      if (!found.password || found.password === password) {
        setUser(found)
        setIsLoading(false)
        return true
      }
    }
    setIsLoading(false)
    return false
  }, [users])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const registerUser = useCallback((newUser: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === newUser.id)
      if (exists) {
        return prev.map((u) => (u.id === newUser.id ? newUser : u))
      }
      return [...prev, newUser]
    })
  }, [])

  const removeUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
  }, [])

  return (
    <AuthContext.Provider value={{ user, users, login, logout, registerUser, removeUser, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
