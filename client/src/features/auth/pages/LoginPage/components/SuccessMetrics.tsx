import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Book, Target } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'

interface MetricItem {
  label: string;
  percentage: number;
}

interface MetricCategory {
  category: string;
  data: MetricItem[];
}

const SuccessMetrics: React.FC = () => {
  const successMetrics: MetricCategory[] = [
    {
      category: 'Spiritual Growth',
      data: [
        { label: 'Couples in full-time service', percentage: 72 },
        { label: 'Increased meeting attendance', percentage: 89 },
        { label: 'More field service hours', percentage: 67 },
        { label: 'Taking on congregation responsibilities', percentage: 54 }
      ]
    },
    {
      category: 'Relationship Quality',
      data: [
        { label: 'Shared spiritual goals', percentage: 95 },
        { label: 'Regular family worship', percentage: 88 },
        { label: 'Joint ministry activities', percentage: 76 },
        { label: 'Spiritual headship appreciation', percentage: 91 }
      ]
    }
  ]

  const iconMap: Record<string, React.ReactNode> = {
    'Spiritual Growth': <TrendingUp className="w-5 h-5" />,
    'Relationship Quality': <Users className="w-5 h-5" />,
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="mt-16"
    >
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Measurable Spiritual Growth</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how relationships formed on JW Lovers lead to tangible spiritual progress
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {successMetrics.map((metric: MetricCategory, index: number) => (
          <motion.div
            key={metric.category}
            variants={fadeInUp}
            custom={index}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                {iconMap[metric.category as keyof typeof iconMap]}
              </div>
              <h4 className="text-xl font-bold text-gray-900">{metric.category}</h4>
            </div>

            <div className="space-y-4">
              {metric.data.map((item: MetricItem, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-bold text-purple-600">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Takeaways */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h5 className="font-bold text-gray-900 mb-2">Shared Goals</h5>
            <p className="text-sm text-gray-600">95% of couples report aligned spiritual objectives</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Book className="w-6 h-6 text-pink-600" />
            </div>
            <h5 className="font-bold text-gray-900 mb-2">Enhanced Study</h5>
            <p className="text-sm text-gray-600">Regular family worship established in 88% of relationships</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h5 className="font-bold text-gray-900 mb-2">Joint Ministry</h5>
            <p className="text-sm text-gray-600">76% engage in regular field service together</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SuccessMetrics