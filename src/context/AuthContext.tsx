'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'resident' | 'attending' | 'admin'
  institution?: string
  specialty?: string
  trainingYear?: string
  onboardingComplete: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'student' | 'resident' | 'attending'
  institution?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Load user profile from Supabase
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) throw error

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name || supabaseUser.email?.split('@')[0] || 'User',
          role: profile.role || 'student',
          institution: profile.institution,
          specialty: profile.specialty,
          trainingYear: profile.training_year,
          onboardingComplete: profile.onboarding_complete || false,
        }
        setUser(userData)
        return userData
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
    return null
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      }
      setIsLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await loadUserProfile(data.user)
        toast.success('Welcome back!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            institution: data.institution,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role,
            institution: data.institution,
            onboarding_complete: false,
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }

        await loadUserProfile(authData.user)
        toast.success('Account created successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed. Please try again.')
      throw error
    }
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user) return

    try {
      const updateData: any = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.role !== undefined) updateData.role = data.role
      if (data.institution !== undefined) updateData.institution = data.institution
      if (data.specialty !== undefined) updateData.specialty = data.specialty
      if (data.trainingYear !== undefined) updateData.training_year = data.trainingYear
      if (data.onboardingComplete !== undefined) updateData.onboarding_complete = data.onboardingComplete

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, ...data })
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
