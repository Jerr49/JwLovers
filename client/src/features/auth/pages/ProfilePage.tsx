import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

// Remove lucide-react imports or install them
// import { Globe, Briefcase, MapPin, Calendar } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated || !user) {
    navigate('/login')
    return null
  }

  // Your useAuth returns a User object, not AuthResponse
  // So we need to work with just the user object
  // If you need profile data, it should be included in the User interface
  
  // For now, let's assume user has these fields (you may need to update your User interface)
  const userData = user
  
  // Combine first and last name for display
  const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
  
  // Determine display name - if you have username in User interface, use it
  const displayName = (userData as any).username || fullName || userData.email?.split('@')[0] || 'User'
  
  // Get initial for avatar
  const profileInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => navigate('/profile/edit')}
              className="btn-primary"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-brand-500 to-purple-600 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-32 h-32 bg-white/90 rounded-full flex items-center justify-center border-4 border-white">
                    {(userData as any).profilePicture?.url ? (
                      <img
                        src={(userData as any).profilePicture.url}
                        alt={displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-brand-600">
                        {profileInitial}
                      </span>
                    )}
                  </div>
                  {(userData as any).profilePicture?.verified && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{displayName}</h2>
                  <p className="text-brand-100 text-lg">{userData.email}</p>
                  {(userData as any).username && (
                    <p className="text-brand-100">@{(userData as any).username}</p>
                  )}
                  {((userData as any).location || (userData as any).occupation) && (
                    <div className="flex flex-wrap gap-4 mt-3">
                      {(userData as any).location && (
                        <div className="flex items-center text-white/90">
                          <span className="mr-1">📍</span>
                          <span>{(userData as any).location}</span>
                        </div>
                      )}
                      {(userData as any).occupation && (
                        <div className="flex items-center text-white/90">
                          <span className="mr-1">💼</span>
                          <span>{(userData as any).occupation}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {(userData as any).profileCompletion || 0}%
                  </div>
                  <div className="text-sm text-white/80">Profile Complete</div>
                  <div className="w-32 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${(userData as any).profileCompletion || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900">{userData.email}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full ${userData.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                        <span className="text-sm text-gray-600">
                          {userData.isEmailVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                    </div>
                    
                    {fullName && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{fullName}</p>
                      </div>
                    )}
                    
                    {(userData as any).username && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Username</p>
                        <p className="text-lg font-semibold text-gray-900">{(userData as any).username}</p>
                      </div>
                    )}
                    
                    {(userData as any).age && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Age</p>
                        <p className="text-lg font-semibold text-gray-900">{(userData as any).age} years</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {(userData as any).occupation && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Occupation</p>
                        <div className="flex items-center">
                          <span className="mr-2">💼</span>
                          <p className="text-lg font-semibold text-gray-900">{(userData as any).occupation}</p>
                        </div>
                      </div>
                    )}
                    
                    {(userData as any).location && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                        <div className="flex items-center">
                          <span className="mr-2">📍</span>
                          <p className="text-lg font-semibold text-gray-900">{(userData as any).location}</p>
                        </div>
                      </div>
                    )}
                    
                    {(userData as any).website && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Website</p>
                        <div className="flex items-center">
                          <span className="mr-2">🌐</span>
                          <a 
                            href={(userData as any).website.startsWith('http') ? (userData as any).website : `https://${(userData as any).website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-brand-600 hover:text-brand-700 hover:underline truncate"
                            title={(userData as any).website}
                          >
                            {(userData as any).website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {(userData as any).createdAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                        <div className="flex items-center">
                          <span className="mr-2">📅</span>
                          <p className="text-lg font-semibold text-gray-900">
                            {format(new Date((userData as any).createdAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Bio Section */}
                {(userData as any).bio ? (
                  <div className="mt-8 pt-6 border-t">
                    <p className="text-sm font-medium text-gray-500 mb-3">About Me</p>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{(userData as any).bio}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t">
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                      <p className="text-gray-500">No bio added yet</p>
                      <button
                        onClick={() => navigate('/profile/edit')}
                        className="mt-3 px-4 py-2 bg-brand-50 text-brand-600 hover:text-brand-700 font-medium rounded-lg hover:bg-brand-100 transition-colors"
                      >
                        + Add a bio
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Interests */}
                {(userData as any).interests && (userData as any).interests.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <p className="text-sm font-medium text-gray-500 mb-3">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {(userData as any).interests.map((interest: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar - Additional Info */}
              <div className="space-y-6">
                {/* Account Status */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Account Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${userData.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'} mr-3`}></div>
                        <span className="font-medium text-gray-900">Email Verification</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${userData.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {userData.isEmailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${(userData as any).isVerified ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                        <span className="font-medium text-gray-900">Profile Verification</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${(userData as any).isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {(userData as any).isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Last Login */}
                {userData.lastLogin && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Last Login</h4>
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">📅</span>
                      <span>{format(new Date(userData.lastLogin), 'MMM d, yyyy')}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(userData.lastLogin), 'h:mm a')}</span>
                    </div>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="bg-brand-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/profile/edit')}
                      className="w-full px-4 py-2.5 bg-white text-brand-600 font-medium rounded-lg border border-brand-200 hover:bg-brand-50 transition-colors text-left"
                    >
                      ✏️ Edit Profile
                    </button>
                    {!userData.isEmailVerified && (
                      <button
                        onClick={() => navigate('/verify-email')}
                        className="w-full px-4 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors text-left"
                      >
                        📧 Verify Email
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-left"
                    >
                      ⚙️ Account Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage