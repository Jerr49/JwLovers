import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Globe, Users, Award, Rocket } from 'lucide-react'
import { timeline } from '../data/constants'
import { fadeInUp } from '../utils/animations'

const PlatformTimeline: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    'Platform Launch': <Rocket className="w-5 h-5" />,
    'Global Expansion': <Globe className="w-5 h-5" />,
    'First 100 Marriages': <Users className="w-5 h-5" />,
    'Mobile App Launch': <TrendingUp className="w-5 h-5" />,
    '10,000 Members': <Users className="w-5 h-5" />,
    'Enhanced Features': <Award className="w-5 h-5" />
  }

  return (
    <div className="py-16">
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">Our Journey</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          From humble beginnings to a global community of believers
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
        
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="w-1/2 px-8">
                <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${
                  index % 2 === 0 ? 'text-right' : 'text-left'
                }`}>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-purple-600">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                  {iconMap[item.title as keyof typeof iconMap]}
                </div>
              </div>
              
              <div className="w-1/2 px-8" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlatformTimeline