'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Upload, X, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

type Banner = {
  id: string
  title: string
  subtitle: string
  cta: string
  link: string
  imageUrl: string
  gradient: string | null
  emoji: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta: '',
    link: '',
    imageUrl: '',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    emoji: '✨',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      toast.error('Không thể tải danh sách banners!')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước file tối đa 2MB!')
      return
    }

    setUploading(true)
    const formDataObj = new FormData()
    formDataObj.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: data.url }))
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Upload ảnh thất bại!')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.subtitle || !formData.cta || !formData.link) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setLoading(true)
    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : '/api/admin/banners'

      const method = editingBanner ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(editingBanner ? 'Cập nhật banner thành công!' : 'Tạo banner thành công!')
      setShowModal(false)
      resetForm()
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Lưu banner thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Xóa banner thành công!')
      fetchBanners()
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Xóa banner thất bại!')
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      cta: banner.cta,
      link: banner.link,
      imageUrl: banner.imageUrl,
      gradient: banner.gradient || 'from-blue-500 via-purple-500 to-pink-500',
      emoji: banner.emoji || '',
      order: banner.order,
      isActive: banner.isActive
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      cta: '',
      link: '',
      imageUrl: '',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      emoji: '✨',
      order: banners.length,
      isActive: true
    })
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive })
      })

      if (!response.ok) throw new Error('Failed to toggle')

      toast.success(banner.isActive ? 'Đã ẩn banner' : 'Đã hiển thị banner')
      fetchBanners()
    } catch (error) {
      console.error('Error toggling banner:', error)
      toast.error('Thao tác thất bại!')
    }
  }

  if (loading && banners.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banners</h1>
          <p className="text-gray-600 mt-1">Quản lý banners slider trang chủ</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm Banner
        </button>
      </div>

      {/* Banners List */}
      <div className="grid gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
          >
            {/* Thumbnail */}
            {banner.imageUrl ? (
              <div className="relative w-32 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className={`w-32 h-20 rounded bg-gradient-to-r ${banner.gradient} flex items-center justify-center text-3xl flex-shrink-0`}>
                {banner.emoji}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{banner.title}</h3>
              <p className="text-sm text-gray-600 truncate">{banner.subtitle}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Thứ tự: {banner.order}</span>
                <span>CTA: {banner.cta}</span>
                <span className="flex items-center gap-1">
                  {banner.isActive ? (
                    <><Eye className="w-3 h-3" /> Đang hiển thị</>
                  ) : (
                    <><EyeOff className="w-3 h-3" /> Đã ẩn</>
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive(banner)}
                className={`p-2 rounded-lg transition-colors ${
                  banner.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={banner.isActive ? 'Ẩn banner' : 'Hiển thị banner'}
              >
                {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleEdit(banner)}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Chưa có banner nào. Hãy tạo banner đầu tiên!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingBanner ? 'Chỉnh sửa Banner' : 'Tạo Banner mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Mua sắm thông minh cùng AI"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Trợ lý AI giúp bạn tìm sản phẩm phù hợp nhất"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* CTA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text nút bấm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
                  placeholder="Khám phá ngay"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/products"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh Banner
                </label>
                {formData.imageUrl && (
                  <div className="mb-3 relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                  <Upload className={`w-5 h-5 ${uploading ? 'animate-bounce' : ''}`} />
                  <span className="text-sm font-medium">
                    {uploading ? 'Đang upload...' : 'Upload ảnh'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Hoặc dán link URL"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Khuyến nghị: 1920x400px, định dạng JPG/PNG/WEBP, &lt; 500KB
                </p>
              </div>

              {/* Gradient (nếu không có ảnh) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient (dự phòng khi không có ảnh)
                </label>
                <input
                  type="text"
                  value={formData.gradient}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                  placeholder="from-blue-500 via-purple-500 to-pink-500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                  placeholder="✨"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Hiển thị banner
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
