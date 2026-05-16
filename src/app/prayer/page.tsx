'use client'

import Link from 'next/link'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { prayer } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { FadeIn } from '@/components/ui/Motion'
import { CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function PrayerPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const privacyValue = formData.get('privacy') as string
      await prayer.submitPrayer({
        name: formData.get('fullName') as string,
        email: formData.get('email') as string,
        request: formData.get('request') as string,
        isPublic: privacyValue === 'public',
      })
      success('Your prayer request has been received.')
      setSubmitted(true)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : 'Failed to submit prayer request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-24 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-[rgba(36, 26, 66, 0.75)]" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-bold text-white md:text-[42px] md:leading-[48px]">
            Prayer Request
          </h1>
          <p className="mt-3 font-serif text-lg font-light text-[#FAFAF8]">
            We stand with you in prayer
          </p>
        </div>
      </section>

      {/* Prayer Form */}
      <SectionWrapper variant="white">
        <FadeIn>
          <div className="mx-auto max-w-xl">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-16 w-16 text-[#27AE60] mb-6" />
                <h3 className="font-heading text-2xl font-bold text-[#0E0B1E] mb-2">
                  Your prayer request has been received
                </h3>
                <p className="font-body text-[#8A8A90] mb-8">
                  Thank you for sharing. Our team will be praying with you.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#0E0B1E] text-white rounded-lg font-semibold hover:bg-[#C9A84C] transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="font-heading text-3xl font-bold text-[#0E0B1E]">
                    Share Your Prayer Request
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Input
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                  />
                  <Input
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                  <Select
                    id="category"
                    name="category"
                    label="Category"
                    required
                    options={[
                      { value: 'personal', label: 'Personal' },
                      { value: 'family', label: 'Family' },
                      { value: 'health', label: 'Health' },
                      { value: 'financial', label: 'Financial' },
                      {
                        value: 'spiritual-growth',
                        label: 'Spiritual Growth',
                      },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                  <Select
                    id="privacy"
                    name="privacy"
                    label="Privacy"
                    required
                    options={[
                      {
                        value: 'public',
                        label: 'Public (shared for corporate prayer)',
                      },
                      {
                        value: 'private',
                        label: 'Private (pastoral team only)',
                      },
                    ]}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="request"
                      className="font-body text-sm font-medium text-[#0E0B1E]"
                    >
                      Prayer Request
                    </label>
                    <textarea
                      id="request"
                      name="request"
                      className="h-40 w-full rounded-lg border border-[#0E0B1E] bg-white px-4 py-3 font-body text-base text-[#0E0B1E] placeholder:text-[#8A8A90] transition-colors duration-150 focus:border-[#C9A84C] focus:ring-3 focus:ring-[#C9A84C]/15 focus:outline-none resize-none"
                      placeholder="Share your prayer need here..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Prayer Request'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </FadeIn>
      </SectionWrapper>
    </>
  )
}
