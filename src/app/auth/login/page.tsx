'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { auth, setToken } from '@/lib/api';
import { FadeIn, HeroText } from '@/components/ui/Motion';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await auth.login(data.email, data.password);
      const token = response.access_token || response.token;

      if (!token) {
        setErrorMessage('Login succeeded but no token received. Please try again.');
        return;
      }

      setToken(token);
      reset();

      const destination =
        response.user?.role === 'ADMIN' || response.user?.role === 'SUPER_ADMIN'
          ? '/admin'
          : '/dashboard';

      window.location.assign(destination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.';

      if (message.includes('401') || /invalid/i.test(message)) {
        setErrorMessage('Invalid email or password');
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-off-white overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0E0B1E 0%, #0E0B1E 50%, #C9A84C 100%)',
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
              Welcome to our faith community. Step into a space where spiritual
              growth, connection, and purpose converge.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base font-serif italic text-off-white/80 leading-relaxed">
              "In community we find strength, in faith we find purpose, in love we
              find home."
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate mb-2">
              The Ecclesia Embassy
            </h1>
            <p className="text-gray-text font-body text-sm">Sign in to your account</p>
          </div>

          <FadeIn>
            <h2 className="hidden lg:block text-3xl font-heading font-bold text-slate mb-2">
              Welcome Back
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="hidden lg:block text-gray-text font-body text-sm mb-8">
              Sign in to continue to your account
            </p>
          </FadeIn>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-md bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] p-4"
            >
              <p className="text-error font-body text-sm">{errorMessage}</p>
            </motion.div>
          )}

          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-body font-medium text-slate mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 border-lavender focus:border-purple-vivid"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-xs font-body mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-body font-medium text-slate mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-lavender focus:border-purple-vivid"
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
                  <p className="text-error text-xs font-body mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox {...register('rememberMe')} className="border-lavender" />
                  <span className="text-sm font-body text-gray-text">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-body text-purple hover:text-purple-vivid transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="w-full mt-6"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-off-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-center text-gray-text font-body text-sm mt-6">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-purple hover:text-purple-vivid font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
