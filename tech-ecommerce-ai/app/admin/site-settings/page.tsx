'use client'

import { useState, useEffect } from 'react'
import { Upload, Save, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function SiteSettingsPage() {
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Fetch logo hiện tại
  useEffect(() => {
    fetchLogo()
  }, [])

  const fetchLogo = async () => {
    try {
      const response = await fetch('/api/admin/site-settings?key=logo')
      if (response.ok) {
        const data = await response.json()
        setLogoUrl(data.value || '')
      }
    } catch (error) {
      console.error('Error fetching logo:', error)
    }
  }

  // Upload ảnh lên Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước file tối đa 2MB!')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setLogoUrl(data.url)
      toast.success('Upload ảnh thành công!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Upload ảnh thất bại!')
    } finally {
      setUploading(false)
    }
  }

  // Lưu logo URL vào database
  const handleSave = async () => {
    if (!logoUrl.trim()) {
      toast.error('Vui lòng nhập hoặc upload logo!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'logo',
          value: logoUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast.success('Lưu logo thành công!')
    } catch (error) {
      console.error('Error saving logo:', error)
      toast.error('Lưu logo thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt Website</h1>
        <p className="text-gray-600 mt-1">Quản lý logo và các cài đặt chung</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Logo Website</h2>

        {/* Preview Logo */}
        {logoUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="relative w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <Image
                src={logoUrl}
                alt="Logo preview"
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Logo
          </label>
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
            <Upload className={`w-5 h-5 ${uploading ? 'animate-bounce' : ''}`} />
            <span className="text-sm font-medium">
              {uploading ? 'Đang upload...' : 'Chọn file ảnh'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WEBP (Tối đa 2MB, khuyến nghị 100x100px)
          </p>
        </div>

        {/* Manual URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hoặc dán link URL
          </label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading || !logoUrl}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  )
}
