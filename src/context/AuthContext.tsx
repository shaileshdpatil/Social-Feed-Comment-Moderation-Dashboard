import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../utils/auth'
import { access_token } from '../config/token'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

interface AuthState {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
  })

  useEffect(() => {
    if (token) {
      setState(prev => ({
        ...prev,
        user: {
          name: "Shailesh Patil",
          email: "testuser@logicwind.com"
        },
      }))
    }
  }, [token])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      if (email === "testuser@logicwind.com" && password === "Test123!") {
        localStorage.setItem("accessToken", access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Please check again");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    localStorage.removeItem("accessToken");
    setState({ user: null, loading: false })
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 