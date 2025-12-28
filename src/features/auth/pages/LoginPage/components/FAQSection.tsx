import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Shield, Lock, Users, Search } from 'lucide-react'
import { faqs } from '../data/constants'
import { fadeInUp } from '../utils/animations'

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="py-16">
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-4">
          <HelpCircle className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-700">Common Questions</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Everything you need to know about JW Lovers
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index: number) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
            className="mb-4"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    {index === 0 && <Shield className="w-4 h-4 text-purple-600" />}
                    {index === 1 && <Users className="w-4 h-4 text-purple-600" />}
                    {index === 2 && <Lock className="w-4 h-4 text-purple-600" />}
                    {index === 3 && <Search className="w-4 h-4 text-purple-600" />}
                  </div>
                  <h3 className="font-bold text-gray-900">{faq.question}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`} />
              </div>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mt-4 text-gray-600 pt-4 border-t border-gray-200">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Additional Help */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-4">Our spiritual advisors are here to help</p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default FAQSection