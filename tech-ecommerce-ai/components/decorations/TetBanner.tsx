'use client'

import Link from 'next/link'
import { Gift, Sparkles } from 'lucide-react'

export default function TetBanner() {
  return (
    <section className="relative bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 text-white py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 text-6xl">🏮</div>
        <div className="absolute top-20 right-32 text-6xl">🧧</div>
        <div className="absolute bottom-10 left-40 text-6xl">🎊</div>
        <div className="absolute bottom-20 right-20 text-6xl">🌸</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-50">🎉</div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse">
            <Gift className="w-5 h-5" />
            <span className="font-bold text-lg">SALE TẾT 2026</span>
            <Gift className="w-5 h-5" />
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            XUÂN SANG - LỘC ĐẾN
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-yellow-200 mb-6">
            🧧 Giảm giá đến 50% + Quà tặng hấp dẫn 🧧
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm md:text-base">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🎁</div>
              <div className="font-semibold">Quà tặng may mắn</div>
              <div className="text-white/90">Với mỗi đơn hàng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🚚</div>
              <div className="font-semibold">Freeship toàn quốc</div>
              <div className="text-white/90">Đơn từ 300K</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Hoàn tiền 15%</div>
              <div className="text-white/90">Cho khách hàng mới</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-yellow-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 transform"
          >
            <Sparkles className="w-6 h-6" />
            MUA SẮM NGAY
            <Sparkles className="w-6 h-6" />
          </Link>

          {/* Countdown or Limited Time Notice */}
          <div className="mt-6 text-yellow-200 font-semibold animate-bounce">
            ⏰ Chương trình có thời hạn - Đừng bỏ lỡ!
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-1 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}
