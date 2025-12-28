import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, MapPin, Award, Users } from 'lucide-react'
import { testimonials } from '../data/constants'
import { useTestimonialCarousel } from '../hooks/useTestimonialCarousel'
import { staggerContainer, fadeInUp } from '../utils/animations'

interface Testimonial {
  id: number;
  name: string;
  story: string;
  duration: string;
  location: string;
  roles: string;
  icon: string;
}

interface TestimonialCategory {
  title: string;
  testimonials: Testimonial[];
}

const Testimonials: React.FC = () => {
  const { currentIndex, goToIndex } = useTestimonialCarousel()

  const testimonialCategories: TestimonialCategory[] = [
    {
      title: 'Pioneer Couples',
      testimonials: testimonials.filter((t) => t.roles?.includes('Pioneer'))
    },
    {
      title: 'Elder Couples',
      testimonials: testimonials.filter((t) => t.roles?.includes('Elder'))
    }
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      id="testimonials"
      className="mt-24"
    >
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
          <Heart className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" />
          <span className="text-sm font-medium text-purple-700">Success Stories</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900">Real Love, Real Faith</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover how believers from around the world found their spiritual partners
        </p>
      </motion.div>

      {/* Featured Testimonials Carousel */}
      <div className="mb-16">
        <div className="relative h-[400px] rounded-3xl overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ 
                opacity: currentIndex === index ? 1 : 0,
                x: currentIndex === index ? 0 : 100,
                scale: currentIndex === index ? 1 : 0.9
              }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 p-8 flex flex-col md:flex-row items-center gap-8 ${
                currentIndex === index ? 'z-10' : 'z-0'
              }`}
            >
              <div className="w-full md:w-2/5">
                <div className="w-64 h-64 rounded-full overflow-hidden mx-auto border-4 border-white shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <span className="text-6xl text-purple-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-3/5 text-white">
                <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{testimonial.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm opacity-90">{testimonial.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-lg italic mb-6">"{testimonial.story}"</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <span className="text-sm">{testimonial.duration}</span>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Roles</span>
                      </div>
                      <span className="text-sm">{testimonial.roles}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-12 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Testimonial Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonialCategories.map((category, index: number) => (
          <motion.div
            key={category.title}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" fill="currentColor" />
              </div>
              <h3 className="font-bold text-gray-900">{category.title}</h3>
            </div>
            
            <div className="space-y-4">
              {category.testimonials.slice(0, 2).map((testimonial: Testimonial) => (
                <div key={testimonial.id} className="border-l-2 border-purple-300 pl-3">
                  <p className="text-sm text-gray-700 italic">"{testimonial.story.substring(0, 80)}..."</p>
                  <p className="text-xs text-gray-500 mt-1">— {testimonial.name}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
              View more stories →
            </button>
          </motion.div>
        ))}
      </div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">5K+</div>
            <div className="text-sm opacity-90">Successful Matches</div>
          </div>
          <div>
            <div className="text-3xl font-bold">120+</div>
            <div className="text-sm opacity-90">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold">200+</div>
            <div className="text-sm opacity-90">Marriages</div>
          </div>
          <div>
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm opacity-90">Satisfaction</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Testimonials