'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Product } from '@prisma/client'

type ProductSectionProps = {
  title: string
  subtitle?: string
  products: Product[]
  viewAllLink?: string
  icon?: React.ReactNode
  gradient?: string
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink,
  icon,
  gradient = 'from-blue-600 to-blue-700'
}: ProductSectionProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Xem tất cả
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
