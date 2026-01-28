'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Building, Mail, Lock, Save, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navigation } from '@/components/Navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  institution: z.string().optional(),
  specialty: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      institution: user?.institution || '',
      specialty: user?.specialty || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      updateUser({
        name: data.name,
        email: data.email,
        institution: data.institution,
        specialty: data.specialty,
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true)
    try {
      // In demo mode, just show success
      // In real app, verify current password and update
      toast.success('Password changed successfully!')
      resetPasswordForm()
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Profile Settings</h1>

            {/* Profile Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        className={cn('pl-10', profileErrors.name && 'border-rose-300')}
                        {...registerProfile('name')}
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-rose-600">{profileErrors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        className={cn('pl-10', profileErrors.email && 'border-rose-300')}
                        {...registerProfile('email')}
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-rose-600">{profileErrors.email.message}</p>
                    )}
                  </div>

                  {/* Institution */}
                  <div>
                    <label
                      htmlFor="institution"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Institution
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="institution"
                        type="text"
                        placeholder="University Hospital"
                        className="pl-10"
                        {...registerProfile('institution')}
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label
                      htmlFor="specialty"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Specialty
                    </label>
                    <select
                      id="specialty"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      {...registerProfile('specialty')}
                    >
                      <option value="">Select specialty</option>
                      <option value="em">Emergency Medicine</option>
                      <option value="im">Internal Medicine</option>
                      <option value="fm">Family Medicine</option>
                      <option value="surgery">Surgery</option>
                      <option value="peds">Pediatrics</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="currentPassword"
                        type="password"
                        className={cn('pl-10', passwordErrors.currentPassword && 'border-rose-300')}
                        {...registerPassword('currentPassword')}
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-rose-600">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        className={cn('pl-10', passwordErrors.newPassword && 'border-rose-300')}
                        {...registerPassword('newPassword')}
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-rose-600">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className={cn('pl-10', passwordErrors.confirmPassword && 'border-rose-300')}
                        {...registerPassword('confirmPassword')}
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-rose-600">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    loading={isChangingPassword}
                    className="w-full"
                  >
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">
                      Email notifications
                    </span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">
                      Weekly progress reports
                    </span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">
                      New case alerts
                    </span>
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
