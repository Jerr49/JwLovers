import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Globe, Sparkles, Heart, Book, Lock } from 'lucide-react'
import { features, platformValues } from '../data/constants'
import { staggerContainer, fadeInUp } from '../utils/animations'

const Features: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield className="w-6 h-6" />,
    Users: <Users className="w-6 h-6" />,
    Globe: <Globe className="w-6 h-6" />,
    Sparkles: <Sparkles className="w-6 h-6" />,
    Heart: <Heart className="w-6 h-6" />,
    Book: <Book className="w-6 h-6" />,
  }

  const valuesIconMap: Record<string, React.ReactNode> = {
    integrity: <Shield className="w-5 h-5" />,
    purity: <Lock className="w-5 h-5" />,
    service: <Users className="w-5 h-5" />,
    community: <Heart className="w-5 h-5" />,
  }

  return (
    <div id="features" className="mt-24">
      {/* Main Features */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">Why Choose Us</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900">
            Built for <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600">Spiritual Connections</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A platform designed specifically for Jehovah's Witnesses seeking meaningful, faith-based relationships
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index: number) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              custom={index}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {iconMap[feature.icon]}
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                <p className="text-gray-500 text-xs">{feature.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Platform Values */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200/50"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Core Values</h3>
          <p className="text-gray-600">Guided by Bible principles in everything we do</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformValues.map((value: { icon: string; title: string; description: string }, index: number) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                {valuesIconMap[value.icon as keyof typeof valuesIconMap]}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
              <p className="text-sm text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bible Verse */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
            <Book className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-gray-700 italic">"Two are better than one... For if one of them falls, the other can help his partner up."</p>
            <p className="text-sm text-gray-500 mt-2">— Ecclesiastes 4:9, 10</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Features