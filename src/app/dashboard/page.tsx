'use client'

import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { giving, prayer, cith, intentionalityClass } from '@/lib/api'
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/Motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import {
  User,
  Heart,
  BookOpen,
  Users,
  Clock,
  Gift,
  ChevronRight,
  Edit3,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

interface DashboardStats {
  totalGiving: number
  prayerRequestsCount: number
  hubStatus: string
  enrolledClassesCount: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch all stats in parallel, catching individual failures
        const [givingData, prayerData, hubData, coursesData] = await Promise.all([
          giving.getHistory().catch(() => []),
          prayer.getMyPrayers().catch(() => []),
          cith.getMyHub().catch(() => null),
          intentionalityClass.getMyCourses().catch(() => []),
        ])

        // Determine hub status
        let hubStatus = 'Not Joined'
        if (hubData && hubData.id) {
          hubStatus = hubData.status === 'ACTIVE' ? 'Hub Leader' : hubData.status || 'Joined'
        }

        setStats({
          totalGiving: Array.isArray(givingData)
            ? givingData.reduce((sum: number, g: any) => sum + (g.amount || 0), 0)
            : 0,
          prayerRequestsCount: Array.isArray(prayerData) ? prayerData.length : 0,
          hubStatus,
          enrolledClassesCount: Array.isArray(coursesData) ? coursesData.length : 0,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchStats()
  }, [user?.id])

  const firstName = user?.profile?.firstName || 'Friend'
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const quickActions = [
    { label: 'Edit Profile', href: '/dashboard/profile', icon: User },
    { label: 'My Courses', href: '/dashboard/class', icon: BookOpen },
    { label: 'My Giving History', href: '/dashboard/giving', icon: Gift },
    { label: 'My Prayer Requests', href: '/dashboard/prayer', icon: Heart },
    { label: 'My Hub', href: '/dashboard/hub', icon: Users },
    { label: 'Edit Website Content', href: '/dashboard/content', icon: Edit3 },
    { label: 'Ecclesia Nation', href: '/nation', icon: BookOpen },
    { label: 'Submit Testimony', href: '/testimonies', icon: Clock },
  ]

  return (
    <ProtectedRoute>
      <div className="bg-[#FAFAF8] min-h-screen pt-8 pb-16">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Welcome Header */}
          <FadeIn>
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0E0B1E] mb-2">
                Welcome back, {firstName}
              </h1>
              <p className="text-[#8A8A90] text-lg">{formattedDate}</p>
            </div>
          </FadeIn>

          {/* Quick Stats */}
          <div className="mb-12">
            <StaggerContainer>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* My Giving Card */}
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#0E0B1E] rounded-full flex items-center justify-center">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-[#8A8A90] text-sm font-medium mb-2">
                      My Giving
                    </h3>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-bold text-[#0E0B1E]">
                        ${stats?.totalGiving || 0}
                      </p>
                    )}
                  </div>
                </StaggerItem>

                {/* Prayer Requests Card */}
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#C9A84C] rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-[#8A8A90] text-sm font-medium mb-2">
                      Prayer Requests
                    </h3>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-bold text-[#0E0B1E]">
                        {stats?.prayerRequestsCount || 0}
                      </p>
                    )}
                  </div>
                </StaggerItem>

                {/* Hub Status Card */}
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#0E0B1E] rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-[#8A8A90] text-sm font-medium mb-2">
                      Hub Status
                    </h3>
                    {loading ? (
                      <Skeleton className="h-8 w-32" />
                    ) : (
                      <p className="text-lg font-bold text-[#0E0B1E]">
                        {stats?.hubStatus || 'Not Joined'}
                      </p>
                    )}
                  </div>
                </StaggerItem>

                {/* Classes Card */}
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#C9A84C] rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-[#8A8A90] text-sm font-medium mb-2">
                      Classes
                    </h3>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-bold text-[#0E0B1E]">
                        {stats?.enrolledClassesCount || 0}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-[#0E0B1E] mb-6">
              Quick Actions
            </h2>
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const IconComponent = action.icon
                  return (
                    <StaggerItem key={action.href}>
                      <Link href={action.href}>
                        <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#E8E6F0] rounded-lg flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-[#0E0B1E]" />
                              </div>
                              <span className="font-semibold text-[#0E0B1E]">
                                {action.label}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#8A8A90]" />
                          </div>
                        </div>
                      </Link>
                    </StaggerItem>
                  )
                })}
              </div>
            </StaggerContainer>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
