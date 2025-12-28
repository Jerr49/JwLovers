import React from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../utils/animations'

const Footer: React.FC = () => {
  return (
    <motion.footer
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.1 }}
      className="relative z-10 mt-24 border-t border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-6 h-6 text-purple-600" fill="currentColor" />
            <span className="text-xl font-bold text-gray-900">JW Lovers</span>
          </div>
          <p className="text-gray-600">
            Building meaningful connections based on faith, trust, and shared values.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Safety Guidelines</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Contact Us</a>
            <a href="#" className="hover:text-purple-600 transition-colors">FAQs</a>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} JW Lovers. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer