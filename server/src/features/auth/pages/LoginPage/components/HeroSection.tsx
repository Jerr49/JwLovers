import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { pulseAnimation, shimmerAnimation } from '../utils/animations'

const HeroSection: React.FC = () => {
  const text = "Spiritual Match".split(" ")
  
  return (
    <div className="space-y-8">
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100
          }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-6 border border-purple-200/50"
        >
          <motion.div
            variants={pulseAnimation}
            animate="animate"
          >
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
          </motion.div>
          <span className="text-sm font-medium text-purple-700">
            Trusted by thousands of believers
          </span>
        </motion.div>

        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
          Find Your{' '}
          <div className="inline-block">
            {text.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-2">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: wordIndex * 0.1 + letterIndex * 0.05,
                      ease: "backOut"
                    }}
                    className="inline-block"
                  >
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                      {letter}
                    </span>
                  </motion.span>
                ))}
              </span>
            ))}
          </div>
        </h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xl text-gray-600"
        >
          Connect with like-minded individuals who share your faith, values, and commitment to building meaningful relationships.
        </motion.p>
      </div>

      {/* Animated CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="pt-4"
      >
        <motion.div
          variants={shimmerAnimation}
          animate="animate"
          className="inline-block rounded-full p-[2px] bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%]"
        >
          <button className="px-8 py-3 rounded-full bg-white font-bold text-gray-900 hover:bg-gray-50 transition-colors">
            Start Your Journey
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroSection