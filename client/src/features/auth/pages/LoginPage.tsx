import React from 'react'
import  LoginForm  from '../components/LoginForm'

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage