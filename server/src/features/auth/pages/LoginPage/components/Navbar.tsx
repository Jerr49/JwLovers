import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar: React.FC = () => {
  return (
    <nav className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              JW Lovers
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Success Stories</a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
            <Link
              to="/register"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Join Free
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar