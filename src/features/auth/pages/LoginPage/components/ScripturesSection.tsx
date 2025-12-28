import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Heart, Users, Star } from 'lucide-react'
import { scriptures } from '../data/constants'
import { fadeInUp } from '../utils/animations'

const ScripturesSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    'Marriage Blessing': <Heart className="w-5 h-5" />,
    'Marriage in the Lord': <Users className="w-5 h-5" />,
    'Companionship': <Users className="w-5 h-5" />,
    'Trust in Jehovah': <Star className="w-5 h-5" />
  }

  return (
    <div className="py-16">
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 mb-4">
          <BookOpen className="w-4 h-4 text-yellow-600 mr-2" />
          <span className="text-sm font-medium text-yellow-700">Bible Principles</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900">Guided by Scripture</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Our approach to relationships is rooted in Bible principles
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scriptures.map((scripture, index: number) => (
          <motion.div
            key={scripture.reference}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <div className="h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  {iconMap[scripture.theme]}
                </div>
                <div>
                  <span className="text-xs font-medium text-purple-600">{scripture.theme}</span>
                  <h4 className="font-bold text-gray-900">{scripture.reference}</h4>
                </div>
              </div>
              
              <p className="text-gray-700 italic mb-4">"{scripture.text}"</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Read more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bible Study CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Strengthen Your Foundation</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Building relationships on Bible principles starts with personal study
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Start Bible Study
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-200 hover:border-blue-300 transition-all">
              Find a Congregation
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ScripturesSection