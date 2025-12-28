// src/features/auth/pages/RegisterPage/RegisterPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Sparkles,
  Users,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";
import RegisterForm from "./components/RegisterForm";
import AnimatedBackground from "../LoginPage/components/AnimatedBackground";
import { fadeInLeft, fadeInRight } from "../LoginPage/utils/animations";

const RegisterPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Community",
      description: "All members are verified through their local congregations",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Faith-Based Matching",
      description: "Connect with those who share your spiritual values",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Meet believers from around the world",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Spiritual Compatibility",
      description: "Advanced matching based on shared beliefs",
    },
  ];

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
                ease: "linear",
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
              Creating your account...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Link to="/" className="flex items-center space-x-2">
                  <Heart
                    className="w-8 h-8 text-purple-600"
                    fill="currentColor"
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    JW Lovers
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center space-x-8"
              >
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Already a member?
                </Link>
              </motion.div>
            </div>
          </div>
        </nav>

        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Benefits & Information */}
              <motion.div
                initial="initial"
                animate={mounted ? "animate" : "initial"}
                variants={fadeInLeft}
                className="space-y-8"
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-6"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-700">
                      Join thousands of believers
                    </span>
                  </motion.div>

                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Start Your{" "}
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                      Spiritual Journey
                    </span>
                  </h1>

                  <p className="text-xl text-gray-600 mb-8">
                    Create your free account and begin connecting with
                    like-minded individuals who share your faith and values.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <div className="text-purple-600">{benefit.icon}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-600">
                        S
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-700 italic">
                        "Found my partner after just 2 weeks. Our shared faith
                        made all the difference!"
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        — Sarah, Married 2 years
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Security Assurance */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">
                          100% Secure:
                        </span>{" "}
                        Your information is encrypted and protected
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Registration Form */}
              <motion.div
                initial="initial"
                animate={mounted ? "animate" : "initial"}
                variants={fadeInRight}
              >
                <RegisterForm />
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-24 text-center"
            >
              <div className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-500/10 rounded-3xl p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Find Meaningful Connections?
                </h2>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Join our community of believers looking for relationships
                  built on faith, trust, and shared values.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  >
                    Sign In to Existing Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/about"
                    className="px-8 py-4 rounded-full bg-white text-purple-600 font-medium border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-24 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Heart
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                />
                <span className="text-xl font-bold text-gray-900">
                  JW Lovers
                </span>
              </div>
              <p className="text-gray-600">
                Building meaningful connections based on faith, trust, and
                shared values.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <Link
                  to="/privacy"
                  className="hover:text-purple-600 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-purple-600 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/safety"
                  className="hover:text-purple-600 transition-colors"
                >
                  Safety Guidelines
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-purple-600 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/faq"
                  className="hover:text-purple-600 transition-colors"
                >
                  FAQs
                </Link>
              </div>
              <p className="mt-8 text-gray-500 text-sm">
                © {new Date().getFullYear()} JW Lovers. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
