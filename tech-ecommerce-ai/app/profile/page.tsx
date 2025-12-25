'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { vietnamProvinces, getDistrictsByProvince } from '@/lib/vietnam-address'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
  const [districts, setDistricts] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    street: '',
  })

  // Update districts when province changes
  useEffect(() => {
    if (selectedProvinceCode) {
      const provinceDistricts = getDistrictsByProvince(selectedProvinceCode)
      setDistricts(provinceDistricts)
    } else {
      setDistricts([])
    }
  }, [selectedProvinceCode])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()

        // Parse address if it exists
        let parsedAddress = { city: '', district: '', ward: '', street: '' }
        if (data.address) {
          const parts = data.address.split('|')
          if (parts.length === 4) {
            parsedAddress = {
              street: parts[0] || '',
              ward: parts[1] || '',
              district: parts[2] || '',
              city: parts[3] || '',
            }
          }
        }

        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          ...parsedAddress,
        })

        // Find province code for the saved city
        if (parsedAddress.city) {
          const province = vietnamProvinces.find(
            (p) => p.name === parsedAddress.city
          )
          if (province) {
            setSelectedProvinceCode(province.code)
          }
        }
      } else {
        toast.error('Không thể tải thông tin')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Combine address parts
      const fullAddress = [
        formData.street,
        formData.ward,
        formData.district,
        formData.city,
      ]
        .filter((part) => part.trim())
        .join('|')

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: fullAddress,
        }),
      })

      if (response.ok) {
        toast.success('Cập nhật thông tin thành công!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">Đang tải...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email không thể thay đổi
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                <MapPin className="inline w-4 h-4 mr-1" />
                Địa chỉ
              </label>

              {/* City - Dropdown */}
              <div>
                <select
                  value={selectedProvinceCode}
                  onChange={(e) => {
                    const code = e.target.value
                    setSelectedProvinceCode(code)
                    const province = vietnamProvinces.find(
                      (p) => p.code === code
                    )
                    if (province) {
                      setFormData({
                        ...formData,
                        city: province.name,
                        district: '',
                      })
                    } else {
                      setFormData({ ...formData, city: '', district: '' })
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>
                  {vietnamProvinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District - Dropdown */}
              <div>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  disabled={!selectedProvinceCode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn Quận/Huyện --</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {!selectedProvinceCode && (
                  <p className="text-xs text-gray-500 mt-1">
                    Vui lòng chọn Tỉnh/Thành phố trước
                  </p>
                )}
              </div>

              {/* Ward */}
              <div>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Phường/Xã (VD: Khuê Mỹ)"
                />
              </div>

              {/* Street */}
              <div>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Số nhà, tên đường (VD: K45/33 Đường K20)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Mẹo:</strong> Thông tin này sẽ được tự động điền khi bạn
            đặt hàng, giúp tiết kiệm thời gian.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
