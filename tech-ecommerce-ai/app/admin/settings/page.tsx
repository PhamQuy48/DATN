'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  avatar: string | null
  createdAt: string
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/profile')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data.user)
      setName(data.user.name)
      setEmail(data.user.email)
      setAvatarUrl(data.user.avatar || '')
      setAvatarPreview(data.user.avatar)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Không thể tải thông tin profile!')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Tối đa 2MB.')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File không phải là ảnh!')
      return
    }

    setAvatarFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null

    try {
      const formData = new FormData()
      formData.append('files', avatarFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.urls[0] || null
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên!')
      return
    }

    if (!email.trim()) {
      toast.error('Vui lòng nhập email!')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ!')
      return
    }

    setSaving(true)

    try {
      let finalAvatarUrl = avatarUrl

      // Upload avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar()
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl
        }
      }

      // Update profile
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          avatar: finalAvatarUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.user)
      setAvatarFile(null)

      toast.success('Đã cập nhật profile thành công!')

      // Refresh page to update layout
      window.location.reload()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Không thể cập nhật profile!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Thông tin cá nhân
          </h2>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {avatarPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                      <Image
                        src={avatarPreview}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center border-4 border-gray-200">
                      <span className="text-white font-bold text-3xl">
                        {name ? name.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    Click vào biểu tượng camera để thay đổi ảnh đại diện
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF (tối đa 2MB)
                  </p>
                  {avatarFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Đã chọn: {avatarFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên hiển thị <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email phải là duy nhất trong hệ thống
              </p>
            </div>

            {/* Role (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {profile?.role || 'ADMIN'}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
