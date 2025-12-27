import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { stats } from '../data/constants'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

// interface Stat {
//   value: string;
//   label: string;
// }

const AnimatedNumber: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const increment = end / (duration * 60) // 60fps
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [end, duration, isInView])

  return <span ref={ref}>{isInView ? count.toLocaleString() : '0'}</span>
}

const parseStatValue = (value: string): number => {
  const num = parseInt(value.replace(/[^0-9]/g, ''))
  return isNaN(num) ? 0 : num
}

const Stats: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, staggerChildren: 0.2 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
    >
      {stats.map((stat, index) => {
        const numberValue = parseStatValue(stat.value)
        const hasPlus = stat.value.includes('+')
        const hasPercent = stat.value.includes('%')
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100 
            }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg text-center group hover:shadow-2xl transition-all duration-500">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-2">
                {numberValue > 0 ? (
                  <>
                    <AnimatedNumber end={numberValue} />
                    {hasPlus && '+'}
                    {hasPercent && '%'}
                  </>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-gray-600 font-medium group-hover:text-purple-700 transition-colors">
                {stat.label}
              </div>
              
              {/* Animated border effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent"
                animate={{
                  borderColor: ['rgba(168,85,247,0)', 'rgba(168,85,247,0.5)', 'rgba(168,85,247,0)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default Stats