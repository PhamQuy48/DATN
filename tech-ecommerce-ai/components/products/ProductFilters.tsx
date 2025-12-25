'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
}

type ProductFiltersProps = {
  categories: Category[]
  brands: string[]
  currentCategory: string
  onFilterChange: (key: string, value: string) => void
}

export default function ProductFilters({
  categories,
  brands,
  currentCategory,
  onFilterChange,
}: ProductFiltersProps) {
  const [showCategories, setShowCategories] = useState(true)
  const [showBrands, setShowBrands] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const handleBrandChange = (brand: string) => {
    const newBrand = selectedBrand === brand ? '' : brand
    setSelectedBrand(newBrand)
    onFilterChange('brand', newBrand)
  }

  const handlePriceChange = () => {
    if (priceRange.min) {
      onFilterChange('minPrice', priceRange.min)
    }
    if (priceRange.max) {
      onFilterChange('maxPrice', priceRange.max)
    }
  }

  const clearFilters = () => {
    setSelectedBrand('')
    setPriceRange({ min: '', max: '' })
    onFilterChange('category', '')
    onFilterChange('brand', '')
    onFilterChange('minPrice', '')
    onFilterChange('maxPrice', '')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
        {(currentCategory || selectedBrand || priceRange.min || priceRange.max) && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-5 pb-5 border-b border-gray-200">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-900 text-sm"
        >
          Danh mục sản phẩm
          {showCategories ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {showCategories && (
          <div className="space-y-1.5">
            <button
              onClick={() => onFilterChange('category', '')}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                !currentCategory
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFilterChange('category', category.slug)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentCategory === category.slug
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-5 pb-5 border-b border-gray-200">
        <button
          onClick={() => setShowBrands(!showBrands)}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-900 text-sm"
        >
          Thương hiệu
          {showBrands ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {showBrands && (
          <div className="space-y-1.5">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedBrand === brand}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-5 pb-5 border-b border-gray-200">
        <button
          onClick={() => setShowPrice(!showPrice)}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-900 text-sm"
        >
          Khoảng giá
          {showPrice ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {showPrice && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1.5 block font-medium">
                Từ (VNĐ)
              </label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1.5 block font-medium">
                Đến (VNĐ)
              </label>
              <input
                type="number"
                placeholder="100000000"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <button
              onClick={handlePriceChange}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm text-sm"
            >
              Áp dụng
            </button>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Lọc nhanh</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => onFilterChange('featured', 'true')}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            🔥 Sản phẩm nổi bật
          </button>
          <button
            onClick={() => onFilterChange('sortBy', 'popular')}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            📈 Bán chạy nhất
          </button>
          <button
            onClick={() => onFilterChange('sortBy', 'rating')}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            ⭐ Đánh giá cao
          </button>
        </div>
      </div>
    </div>
  )
}
