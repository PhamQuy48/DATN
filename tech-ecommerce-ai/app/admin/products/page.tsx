'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'
import { isValidImageUrl } from '@/lib/utils/image-validator'
import type { Product } from '@prisma/client'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  Save,
  Mail,
} from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'
import SendPromotionModal from '@/components/admin/SendPromotionModal'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [promotionProduct, setPromotionProduct] = useState<Product | null>(null)
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    price: 0,
    stock: 0,
    description: '',
    categoryId: '',
    rating: 5,
    reviews: 0,
    images: null,
    featured: false,
    hot: false,
  })

  // Fetch products and categories from API
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Admin page needs all products - set high limit
      const response = await fetch('/api/products?limit=1000')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Không thể tải danh sách sản phẩm!')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      return
    }

    try {
      console.log('🗑️ Deleting product:', name, id)
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      console.log('🗑️ Delete response:', data)

      if (!response.ok) {
        // Show detailed error message from API
        const errorMessage = data.details || data.error || 'Failed to delete product'
        throw new Error(errorMessage)
      }

      setProducts(products.filter(p => p.id !== id))
      toast.success(`Đã xóa sản phẩm "${name}" thành công!`)
      console.log('✅ Product deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Không thể xóa sản phẩm!'
      toast.error(`Lỗi: ${errorMessage}`)
    }
  }

  const handleEdit = (product: Product) => {
    // Convert images from comma-separated string to array for editing
    let imagesArray: string[] | null = null
    if (product.images && typeof product.images === 'string') {
      const imagesList = product.images.split(',').map(img => img.trim()).filter(img => img)
      imagesArray = imagesList.length > 0 ? imagesList : null
    }

    setEditingProduct({
      ...product,
      images: imagesArray as any  // Convert to array for ImageUpload component
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const data = await response.json()

      setProducts(products.map(p =>
        p.id === editingProduct.id ? data.product : p
      ))

      toast.success('Đã cập nhật sản phẩm thành công!')
      setIsModalOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Không thể cập nhật sản phẩm!')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    setIsAddModalOpen(true)
  }

  const handleSaveNewProduct = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.price) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (!newProduct.categoryId) {
      toast.error('Vui lòng chọn danh mục!')
      return
    }

    // Images là optional - nếu không có sẽ dùng placeholder
    // if (!newProduct.images || newProduct.images.length === 0) {
    //   toast.error('Vui lòng thêm ít nhất 1 hình ảnh sản phẩm!')
    //   return
    // }

    try {
      const productData = {
        name: newProduct.name,
        slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
        brand: newProduct.brand,
        price: newProduct.price,
        salePrice: newProduct.salePrice || null,
        description: newProduct.description || 'Sản phẩm chất lượng cao',
        categoryId: newProduct.categoryId || '1',
        stock: newProduct.stock || 0,
        rating: newProduct.rating || 5,
        reviews: newProduct.reviews || 0,
        images: newProduct.images || null,  // Allow null - backend will use placeholder
        featured: newProduct.featured || false,
        hot: newProduct.hot || false,
      }

      console.log('📤 Creating product with data:', productData)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()
      console.log('📥 API Response:', { status: response.status, data })

      if (!response.ok) {
        // Show detailed error message from API
        const errorMessage = data.error || data.details || 'Failed to create product'
        throw new Error(errorMessage)
      }

      setProducts([data.product, ...products])
      toast.success('Đã thêm sản phẩm mới thành công!')
      setIsAddModalOpen(false)
      setNewProduct({
        name: '',
        brand: '',
        price: 0,
        stock: 0,
        description: '',
        categoryId: '1',
        rating: 5,
        reviews: 0,
        images: null,
        featured: false,
        hot: false,
      })
    } catch (error) {
      console.error('❌ Error creating product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm!'
      toast.error(`Lỗi: ${errorMessage}`)
    }
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setNewProduct({
      name: '',
      brand: '',
      price: 0,
      stock: 0,
      description: '',
      categoryId: '1',
      rating: 5,
      reviews: 0,
      images: null,
      featured: false,
      hot: false,
    })
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-1">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredProducts.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Còn hàng</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {filteredProducts.filter(p => p.stock > 0).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hết hàng</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {filteredProducts.filter(p => p.stock === 0).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tồn kho thấp</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {filteredProducts.filter(p => p.stock > 0 && p.stock < 10).length}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tồn kho</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đã bán</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  // Get product image URL
                  let imageUrl = ''
                  try {
                    if (product.images) {
                      const imagesArray = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
                      imageUrl = Array.isArray(imagesArray) && imagesArray.length > 0 ? imagesArray[0] : ''
                    }
                    if (!imageUrl) {
                      imageUrl = product.thumbnail || ''
                    }
                  } catch (e) {
                    imageUrl = product.thumbnail || ''
                  }
                  const hasValidImage = isValidImageUrl(imageUrl)

                  return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {hasValidImage ? (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-lg">📦</div>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {product.categoryId === '1' ? 'Laptop' :
                         product.categoryId === '2' ? 'Smartphone' :
                         product.categoryId === '3' ? 'Tablet' : 'Phụ kiện'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(product.salePrice || product.price)}
                        </p>
                        {product.salePrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-sm font-medium rounded ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-700'
                          : product.stock < 10
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.sold}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPromotionProduct(product)
                            setIsPromotionModalOpen(true)
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Gửi email khuyến mãi"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h2>
              <button
                onClick={handleCloseAddModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="VD: MacBook Pro M3 14 inch"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  placeholder="VD: Apple, Dell, Samsung..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-600">*</span>
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price & Sale Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá gốc (VNĐ) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={newProduct.salePrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Để trống nếu không có KM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Product Flags */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Đánh dấu sản phẩm
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="new-featured"
                      checked={newProduct.featured || false}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="new-featured" className="text-sm text-gray-700 cursor-pointer">
                      ⭐ <strong>Sản phẩm nổi bật</strong> - Hiển thị ở trang chủ section "Featured Products"
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="new-hot"
                      checked={newProduct.hot || false}
                      onChange={(e) => setNewProduct({ ...newProduct, hot: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="new-hot" className="text-sm text-gray-700 cursor-pointer">
                      🔥 <strong>Sản phẩm HOT</strong> - Sản phẩm bán chạy, được quan tâm nhiều
                    </label>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <input
                      type="checkbox"
                      checked={!!newProduct.salePrice && newProduct.salePrice > 0}
                      disabled
                      className="w-4 h-4 text-red-600 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      💰 <strong>Sản phẩm giảm giá</strong> - Tự động khi có "Giá khuyến mãi"
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả sản phẩm
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={4}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá (0-5 sao)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng đánh giá
                  </label>
                  <input
                    type="number"
                    value={newProduct.reviews}
                    onChange={(e) => setNewProduct({ ...newProduct, reviews: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <ImageUpload
                images={newProduct.images ? (Array.isArray(newProduct.images) ? newProduct.images : []) : []}
                onImagesChange={(images) => setNewProduct({ ...newProduct, images: images.length > 0 ? JSON.stringify(images) : null })}
                maxImages={5}
              />
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseAddModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNewProduct}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Price & Sale Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá gốc (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Để trống nếu không có KM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Product Flags */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Đánh dấu sản phẩm
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="edit-featured" className="text-sm text-gray-700 cursor-pointer">
                      ⭐ <strong>Sản phẩm nổi bật</strong> - Hiển thị ở trang chủ section "Featured Products"
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="edit-hot"
                      checked={editingProduct.hot || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, hot: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="edit-hot" className="text-sm text-gray-700 cursor-pointer">
                      🔥 <strong>Sản phẩm HOT</strong> - Sản phẩm bán chạy, được quan tâm nhiều
                    </label>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <input
                      type="checkbox"
                      checked={!!editingProduct.salePrice && editingProduct.salePrice > 0}
                      disabled
                      className="w-4 h-4 text-red-600 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      💰 <strong>Sản phẩm giảm giá</strong> - Tự động khi có "Giá khuyến mãi"
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả sản phẩm
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá (0-5 sao)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={editingProduct.rating}
                  onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Reviews Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng đánh giá
                </label>
                <input
                  type="number"
                  value={editingProduct.reviews}
                  onChange={(e) => setEditingProduct({ ...editingProduct, reviews: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                images={editingProduct.images ? (Array.isArray(editingProduct.images) ? editingProduct.images : []) : []}
                onImagesChange={(images) => setEditingProduct({ ...editingProduct, images: images.length > 0 ? JSON.stringify(images) : null })}
                maxImages={5}
              />
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Email Modal */}
      {promotionProduct && (
        <SendPromotionModal
          product={promotionProduct}
          isOpen={isPromotionModalOpen}
          onClose={() => {
            setIsPromotionModalOpen(false)
            setPromotionProduct(null)
          }}
        />
      )}
    </div>
  )
}
