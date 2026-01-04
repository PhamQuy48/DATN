'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

type Banner = {
  id: string
  title: string
  subtitle: string
  cta: string
  link: string
  gradient: string | null
  emoji?: string | null
  imageUrl: string
  order: number
  isActive: boolean
}

// Banners mặc định (fallback nếu chưa có data trong DB)
const defaultBanners: Banner[] = [
  {
    id: '1',
    title: 'Mua sắm thông minh cùng AI',
    subtitle: 'Trợ lý AI giúp bạn tìm sản phẩm phù hợp nhất',
    cta: 'Khám phá ngay',
    link: '/products',
    gradient: 'from-orange-400 via-red-500 to-pink-600',
    emoji: '🤖',
    imageUrl: '',
    order: 0,
    isActive: true
  },
  {
    id: '2',
    title: 'Flash Sale - Giảm đến 50%',
    subtitle: 'Sản phẩm công nghệ cao cấp với giá tốt nhất',
    cta: 'Mua ngay',
    link: '/products?sale=true',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    emoji: '🔥',
    imageUrl: '',
    order: 1,
    isActive: true
  },
  {
    id: '3',
    title: 'Sản phẩm mới nhất 2025',
    subtitle: 'Cập nhật xu hướng công nghệ mới nhất',
    cta: 'Xem ngay',
    link: '/products?sort=newest',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    emoji: '⚡',
    imageUrl: '',
    order: 2,
    isActive: true
  },
  {
    id: '4',
    title: 'Bảo hành chính hãng',
    subtitle: '100% sản phẩm chính hãng, bảo hành toàn quốc',
    cta: 'Tìm hiểu thêm',
    link: '/products',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    emoji: '✨',
    imageUrl: '',
    order: 3,
    isActive: true
  }
]

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [banners, setBanners] = useState<Banner[]>(defaultBanners)

  // Fetch banners từ database
  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners?public=true')
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setBanners(data)
        }
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      // Sử dụng defaultBanners nếu fetch thất bại
    }
  }

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Chuyển sau 5 giây

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div
      className="relative w-full h-[400px] overflow-hidden rounded-2xl group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`min-w-full h-full ${banner.imageUrl ? 'bg-gray-900' : `bg-gradient-to-br ${banner.gradient}`} relative flex items-center overflow-hidden`}
          >
            {/* Background Image - nếu có imageUrl */}
            {banner.imageUrl && (
              <div className="absolute inset-0">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover opacity-70"
                  priority={banner.order === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent"></div>
              </div>
            )}

            {/* Background decorations - chỉ hiển thị khi dùng gradient */}
            {!banner.imageUrl && (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              </>
            )}

            {/* Content */}
            <div className="container-custom relative z-10">
              <div className="max-w-2xl text-white">
                {banner.emoji && (
                  <div className="text-6xl mb-4 animate-bounce">
                    {banner.emoji}
                  </div>
                )}

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">Ưu đãi đặc biệt</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {banner.title}
                </h2>

                <p className="text-lg md:text-xl mb-6 text-white/90">
                  {banner.subtitle}
                </p>

                <Link
                  href={banner.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  {banner.cta}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
