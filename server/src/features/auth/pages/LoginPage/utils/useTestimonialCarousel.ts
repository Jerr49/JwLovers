import { useState, useEffect } from 'react'
import { testimonials } from '../data/constants'

export const useTestimonialCarousel = (interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  return {
    currentIndex,
    testimonials,
    goToIndex,
  }
}