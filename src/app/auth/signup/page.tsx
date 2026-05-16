'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { auth } from '@/lib/api';
import { FadeIn, HeroText } from '@/components/ui/Motion';
import { motion } from 'framer-motion';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await auth.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      setIsSuccess(true);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred. Please try again.';
      if (errorMsg.includes('409') || errorMsg.includes('already exists')) {
        setErrorMessage('An account with this email already exists');
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen bg-off-white overflow-hidden">
        {/* Left Side - Hero Section */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #0E0B1E 0%, #0E0B1E 50%, #C9A84C 100%)`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-[rgba(14,0,22,0.6)]" />

          <div className="relative z-10 max-w-sm text-center text-off-white">
            <HeroText className="text-5xl md:text-6xl font-heading font-bold mb-6 text-off-white leading-tight">
              The Ecclesia Embassy
            </HeroText>
            <p className="text-lg font-body text-off-white/90 leading-relaxed">
              Join our spiritual community and become part of something greater.
            </p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
              </motion.div>

              <h3 className="font-heading text-2xl font-bold text-slate mb-3">
                Account Created Successfully
              </h3>
              <p className="font-body text-gray-text text-sm mb-8 leading-relaxed">
                Check your email to verify your account. You'll need to confirm your email address before you can sign in.
              </p>

              <Link href="/auth/login" className="inline-block">
                <Button variant="primary">Return to Login</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-off-white overflow-hidden">
      {/* LEFT SIDE - Hero Section */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0E0B1E 0%, #0E0B1E 50%, #C9A84C 100%)`,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-[rgba(14,0,22,0.6)]" />

        <div className="relative z-10 max-w-sm text-center text-off-white">
          <FadeIn>
            <HeroText className="text-5xl md:text-6xl font-heading font-bold mb-6 text-off-white leading-tight">
              The Ecclesia Embassy
            </HeroText>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-lg font-body text-off-white/90 mb-8 leading-relaxed">
              Join our spiritual community. Create your account and become part of the nation of believers.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base font-serif italic text-off-white/80 leading-relaxed">
              "Where heaven meets earth, community thrives and faith flourishes."
            </p>
          </FadeIn>
        </div>
      </div>

      {/* RIGHT SIDE - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Branding */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate mb-2">
              The Ecclesia Embassy
            </h1>
            <p className="text-gray-text font-body text-sm">Create your account</p>
          </div>

          {/* Heading */}
          <FadeIn>
            <h2 className="hidden lg:block text-3xl font-heading font-bold text-slate mb-2">
              Create Account
            </h2>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.1}>
            <p className="hidden lg:block text-gray-text font-body text-sm mb-8">
              Join our faith community today
            </p>
          </FadeIn>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-md bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] p-4"
            >
              <p className="text-error font-body text-sm">{errorMessage}</p>
            </motion.div>
          )}

          {/* Form */}
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-body font-medium text-slate mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="border-lavender focus:border-purple-vivid"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-error text-xs font-body mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-body font-medium text-slate mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="border-lavender focus:border-purple-vivid"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-error text-xs font-body mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-body font-medium text-slate mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-lavender focus:border-purple-vivid"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-error text-xs font-body mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-body font-medium text-slate mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pr-10 border-lavender focus:border-purple-vivid"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-slate transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs font-body mt-1">{errors.password.message}</p>
                )}

                {/* Password Requirements */}
                <div className="mt-4 space-y-2">
                  <p className="font-body text-xs font-medium text-slate">Password requirements:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs font-body">
                      <span
                        className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                          password && password.length >= 8
                            ? 'bg-success text-off-white'
                            : 'bg-lavender text-slate'
                        }`}
                      >
                        {password && password.length >= 8 && <Check className="w-3 h-3" />}
                      </span>
                      <span className={password && password.length >= 8 ? 'text-success' : 'text-gray-text'}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs font-body">
                      <span
                        className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                          password && /[A-Z]/.test(password)
                            ? 'bg-success text-off-white'
                            : 'bg-lavender text-slate'
                        }`}
                      >
                        {password && /[A-Z]/.test(password) && <Check className="w-3 h-3" />}
                      </span>
                      <span className={password && /[A-Z]/.test(password) ? 'text-success' : 'text-gray-text'}>
                        One uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs font-body">
                      <span
                        className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                          password && /[0-9]/.test(password)
                            ? 'bg-success text-off-white'
                            : 'bg-lavender text-slate'
                        }`}
                      >
                        {password && /[0-9]/.test(password) && <Check className="w-3 h-3" />}
                      </span>
                      <span className={password && /[0-9]/.test(password) ? 'text-success' : 'text-gray-text'}>
                        One number
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs font-body">
                      <span
                        className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                          password && /[^A-Za-z0-9]/.test(password)
                            ? 'bg-success text-off-white'
                            : 'bg-lavender text-slate'
                        }`}
                      >
                        {password && /[^A-Za-z0-9]/.test(password) && <Check className="w-3 h-3" />}
                      </span>
                      <span className={password && /[^A-Za-z0-9]/.test(password) ? 'text-success' : 'text-gray-text'}>
                        One special character
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-body font-medium text-slate mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pr-10 border-lavender focus:border-purple-vivid"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-slate transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-xs font-body mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="w-full mt-6"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-off-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </FadeIn>

          {/* Sign In Link */}
          <FadeIn delay={0.3}>
            <p className="text-center text-gray-text font-body text-sm mt-6">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-purple hover:text-purple-vivid font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
