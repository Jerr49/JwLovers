import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
}

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -80,
    rotate: -10
  },
  animate: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "circOut"
    }
  }
}

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 80,
    rotate: 10
  },
  animate: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "circOut"
    }
  }
}

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.6,
    rotate: -15
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "backOut"
    }
  }
}

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
}

export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
}

export const shimmerAnimation: Variants = {
  initial: { backgroundPosition: '-200% center' },
  animate: {
    backgroundPosition: ['-200% center', '200% center'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const rotateAnimation: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const slideInBottom: Variants = {
  initial: {
    opacity: 0,
    y: 100,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "circOut"
    }
  }
}