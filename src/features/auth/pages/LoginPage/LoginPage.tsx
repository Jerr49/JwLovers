import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LoginForm from './components/LoginForm'
import Features from './components/Features'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import SuccessMetrics from './components/SuccessMetrics'
import PlatformTimeline from './components/PlatformTimeline'
import FAQSection from './components/FAQSection'
import TeamSection from './components/TeamSection'
import ScripturesSection from './components/ScripturesSection'
import CTA from './components/CTA'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import { fadeInLeft, fadeInRight, slideInBottom } from './utils/animations'

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden relative">
      <AnimatedBackground />
      
      {/* Loading animation */}
      <AnimatePresence>
        {!mounted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-6xl text-white mb-4"
            >
              ♥
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-lg font-medium"
            >
              JW Lovers
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <Navbar />
        
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section with Login Form */}
            <motion.div
              initial="initial"
              animate={mounted ? "animate" : "initial"}
              className="grid lg:grid-cols-2 gap-12 items-center mb-24"
            >
              <motion.div variants={fadeInLeft}>
                <HeroSection />
                <Stats />
              </motion.div>
              
              <motion.div variants={fadeInRight}>
                <LoginForm />
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInBottom}
              id="features"
            >
              <Features />
            </motion.div>

            {/* Success Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24"
            >
              <SuccessMetrics />
            </motion.div>

            {/* Scriptures Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mt-24"
            >
              <ScripturesSection />
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24"
              id="testimonials"
            >
              <Testimonials />
            </motion.div>

            {/* Platform Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24"
              id="timeline"
            >
              <PlatformTimeline />
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24"
              id="team"
            >
              <TeamSection />
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24"
              id="faq"
            >
              <FAQSection />
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-24"
            >
              <CTA />
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default LoginPage