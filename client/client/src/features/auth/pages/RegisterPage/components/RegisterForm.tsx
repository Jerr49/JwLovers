// src/features/auth/pages/RegisterPage/components/RegisterForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ChevronRight,
  Shield,
  Check,
} from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface PasswordRequirement {
  text: string;
  met: boolean;
}

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const passwordRequirements: PasswordRequirement[] = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { text: "At least one number", met: /[0-9]/.test(password) },
    {
      text: "At least one special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Register data:", data);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">
            Start your journey to meaningful connections
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/50"
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/50"
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">@</span>
              </div>
              <input
                type="text"
                {...register("username")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/50"
                placeholder="johndoe"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                {...register("email")}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/50"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/50"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-3 space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      req.met ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {req.met && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span
                    className={`text-sm ${
                      req.met ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white/50"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register("terms")}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>
            <label className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center group"
            >
              Sign in here
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
