import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Please enter a valid age').optional(),
  location: z.string().min(2, 'Location must be at least 2 characters').optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const EditProfilePage: React.FC = () => {
  const { user, profile, updateProfile, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      age: profile?.age,
      location: profile?.location || '',
    },
  })

  const bioLength = watch('bio')?.length || 0

  const onSubmit = async (data: ProfileFormData) => {
    clearError()
    
    try {
      await updateProfile(data)  // No userId needed, just pass data
      navigate('/profile')
    } catch (err) {
      // Error is handled by Redux
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Profile
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <div></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className="input-primary"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className="input-primary"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      @
                    </span>
                    <input
                      id="username"
                      type="text"
                      {...register('username')}
                      className="input-primary rounded-l-none"
                      placeholder="username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register('bio')}
                    className="input-primary"
                    placeholder="Tell others about yourself, your interests, what you're looking for..."
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      {bioLength}/500 characters
                    </p>
                    {errors.bio && (
                      <p className="text-sm text-red-600">{errors.bio.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="input-primary"
                    min="18"
                    max="100"
                    placeholder="25"
                  />
                  {errors.age && (
                    <p className="mt-2 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    {...register('location')}
                    className="input-primary"
                    placeholder="City, Country"
                  />
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-primary bg-gray-50 cursor-not-allowed"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Contact support to change your email address
                </p>
              </div>
              
              {user && !user.isEmailVerified && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-600">⚠</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Email not verified
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Please verify your email address to access all features.
                        </p>
                      </div>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => navigate('/verify-email')}
                          className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                        >
                          Resend verification email →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditProfilePage