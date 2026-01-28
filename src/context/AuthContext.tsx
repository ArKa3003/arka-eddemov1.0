'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient, IS_SUPABASE_CONFIGURED } from '@/lib/supabase/client'
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

const DEMO_USER: User = {
  id: 'demo',
  email: 'demo@arka-ed.com',
  name: 'Demo User',
  role: 'resident',
  onboardingComplete: true,
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
  const supabase = IS_SUPABASE_CONFIGURED ? createClient() : null

  // Load user profile from Supabase (only when configured)
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!supabase) return null
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) throw error

      if (profile) {
        const profileData = profile as {
          id: string
          email: string
          full_name: string | null
          role: 'student' | 'resident' | 'attending' | 'admin'
          institution: string | null
          specialty_track: string | null
          training_year: number | null
          onboarding_completed: boolean
        }
        const userData: User = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name || supabaseUser.email?.split('@')[0] || 'User',
          role: profileData.role || 'student',
          institution: profileData.institution || undefined,
          specialty: profileData.specialty_track || undefined,
          trainingYear: profileData.training_year?.toString() || undefined,
          onboardingComplete: profileData.onboarding_completed || false,
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
    if (!IS_SUPABASE_CONFIGURED) {
      console.warn('Supabase not configured — running in demo mode')
      setUser(DEMO_USER)
      setIsLoading(false)
      return
    }

    if (!supabase) return

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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
    if (!IS_SUPABASE_CONFIGURED) {
      toast.error('Demo mode — configure Supabase for real sign-in.')
      return
    }
    setIsLoading(true)
    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
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
    if (!IS_SUPABASE_CONFIGURED) {
      toast.error('Demo mode — configure Supabase for real registration.')
      return
    }
    setIsLoading(true)
    try {
      const { data: authData, error: authError } = await supabase!.auth.signUp({
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
        const { error: profileError } = await supabase!
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.name,
            role: data.role,
            institution: data.institution || null,
            onboarding_completed: false,
          } as any)

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
    if (!IS_SUPABASE_CONFIGURED) {
      toast('Demo mode — you’re always signed in as the demo user.', {
        icon: 'ℹ️',
      })
      return
    }
    try {
      const { error } = await supabase!.auth.signOut()
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

    if (!IS_SUPABASE_CONFIGURED) {
      setUser({ ...user, ...data })
      toast.success('Profile updated (demo mode — changes not persisted)')
      return
    }

    try {
      const updateData: any = {}
      if (data.name !== undefined) updateData.full_name = data.name
      if (data.role !== undefined) updateData.role = data.role
      if (data.institution !== undefined) updateData.institution = data.institution
      if (data.specialty !== undefined) updateData.specialty_track = data.specialty
      if (data.trainingYear !== undefined) updateData.training_year = parseInt(data.trainingYear) || null
      if (data.onboardingComplete !== undefined) updateData.onboarding_completed = data.onboardingComplete

      const { error } = await supabase!
        .from('profiles')
        .update(updateData as any as never)
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
