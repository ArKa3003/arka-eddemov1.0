'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navigation } from '@/components/Navigation'
import { cn } from '@/lib/utils'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
    role: z.enum(['student', 'resident', 'attending'], {
      required_error: 'Please select your role',
    }),
    institution: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register: registerUser, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const plan = searchParams.get('plan')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
      institution: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        institution: data.institution,
      })
      router.push('/onboarding')
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
              <p className="text-slate-600">Start mastering medical imaging appropriateness</p>
              {plan && (
                <p className="mt-2 text-sm text-cyan-600 font-medium">
                  Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </p>
              )}
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Dr. Jane Smith"
                    className={cn(
                      'pl-10',
                      errors.name && 'border-rose-300 focus:ring-rose-500'
                    )}
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@hospital.edu"
                    className={cn(
                      'pl-10',
                      errors.email && 'border-rose-300 focus:ring-rose-500'
                    )}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={cn(
                      'pl-10 pr-10',
                      errors.password && 'border-rose-300 focus:ring-rose-500'
                    )}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={cn(
                      'pl-10 pr-10',
                      errors.confirmPassword && 'border-rose-300 focus:ring-rose-500'
                    )}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg border bg-white',
                    'text-slate-900',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
                    errors.role
                      ? 'border-rose-300 focus:ring-rose-500'
                      : 'border-slate-300'
                  )}
                  {...register('role')}
                >
                  <option value="">Select your role</option>
                  <option value="student">Medical Student</option>
                  <option value="resident">Resident Physician</option>
                  <option value="attending">Attending Physician</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-rose-600">{errors.role.message}</p>
                )}
              </div>

              {/* Institution (optional) */}
              <div>
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Institution <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="institution"
                    type="text"
                    placeholder="University Hospital"
                    className="pl-10"
                    {...register('institution')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
              >
                Create account
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
