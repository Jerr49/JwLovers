import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { fadeInUp } from '../utils/animations'

const CTA: React.FC = () => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.2 }}
      className="mt-24 text-center"
    >
      <div className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-500/10 rounded-3xl p-12">
        <Heart className="w-16 h-16 text-purple-600 mx-auto mb-6" fill="currentColor" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to Find Your Match?
        </h2>
        <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
          Join our community of believers looking for meaningful, lasting relationships built on faith and shared values.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
          >
            Create Free Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <button className="px-8 py-4 rounded-full bg-white text-purple-600 font-medium border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CTA