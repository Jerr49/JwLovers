import React from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { team } from '../data/constants'
import { fadeInUp } from '../utils/animations'

const TeamSection: React.FC = () => {
  return (
    <div className="py-16">
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-4">
          <Users className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-700">Behind JW Lovers</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900">Meet Our Team</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Dedicated believers committed to helping you find meaningful connections
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index: number) => (
          <motion.div
            key={member.name}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
            whileHover={{ y: -10 }}
            className="group"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-purple-600">
                  {member.name.split(' ')[1].charAt(0)}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-center mb-2">{member.name}</h3>
              <p className="text-purple-600 text-sm text-center mb-4">{member.role}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">{member.experience}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-700 italic">"{member.quote}"</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TeamSection