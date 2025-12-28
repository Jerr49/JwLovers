import React from 'react'
import { motion } from 'framer-motion'
import { rotateAnimation, floatAnimation } from '../utils/animations'

const AnimatedBackground: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 20,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15
  }))

  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 200 + 100,
    rotation: Math.random() * 360,
    color: i % 2 === 0 ? 'from-purple-300/20' : 'from-pink-300/20'
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={`shape-${shape.id}`}
          className={`absolute w-64 h-64 rounded-full bg-gradient-to-r ${shape.color} to-transparent blur-3xl`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          variants={rotateAnimation}
          initial="initial"
          animate="animate"
          transition={{
            duration: shape.id % 2 === 0 ? 40 : 60,
            repeat: Infinity,
            ease: "linear",
            delay: shape.id * 2
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.05) 70%, transparent 100%)`,
          }}
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated gradient lines */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        />
      </div>

      {/* Floating hearts */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-purple-400/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear"
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedBackground