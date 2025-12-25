'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Calendar, Percent, DollarSign, Tag, Mail, Send, Users, Check } from 'lucide-react'
import toast from 'react-hot-toast'

type Voucher = {
  id: string
  code: string
  description: string | null
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  minOrderValue: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  validFrom: string
  validUntil: string
  active: boolean
  createdAt: string
  _count?: {
    orders: number
  }
}

type FormData = {
  code: string
  description: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: string
  minOrderValue: string
  maxDiscount: string
  usageLimit: string
  validFrom: string
  validUntil: string
  active: boolean
}

type User = {
  id: string
  name: string
  email: string
  role: string
  banned: boolean
}

export default function VouchersAdminPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Send voucher modal
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const getDefaultDates = () => {
    const now = new Date()
    const nextMonth = new Date(now)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    return {
      validFrom: now.toISOString().slice(0, 16),
      validUntil: nextMonth.toISOString().slice(0, 16)
    }
  }

  const [formData, setFormData] = useState<FormData>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    ...getDefaultDates(),
    active: true
  })

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/admin/vouchers')
      const data = await response.json()
      setVouchers(data.vouchers || [])
    } catch (error) {
      console.error('Error fetching vouchers:', error)
      toast.error('Failed to load vouchers')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      ...getDefaultDates(),
      active: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/admin/vouchers/${editingId}` : '/api/admin/vouchers'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save voucher')
      }

      toast.success(editingId ? 'Voucher updated!' : 'Voucher created!')
      resetForm()
      fetchVouchers()
    } catch (error: any) {
      console.error('Error saving voucher:', error)
      toast.error(error.message || 'Failed to save voucher')
    }
  }

  const handleEdit = (voucher: Voucher) => {
    setFormData({
      code: voucher.code,
      description: voucher.description || '',
      discountType: voucher.discountType,
      discountValue: voucher.discountValue.toString(),
      minOrderValue: voucher.minOrderValue?.toString() || '',
      maxDiscount: voucher.maxDiscount?.toString() || '',
      usageLimit: voucher.usageLimit?.toString() || '',
      validFrom: new Date(voucher.validFrom).toISOString().slice(0, 16),
      validUntil: new Date(voucher.validUntil).toISOString().slice(0, 16),
      active: voucher.active
    })
    setEditingId(voucher.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return

    try {
      const response = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete voucher')
      }

      toast.success('Voucher deleted!')
      fetchVouchers()
    } catch (error: any) {
      console.error('Error deleting voucher:', error)
      toast.error(error.message || 'Failed to delete voucher')
    }
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const isUpcoming = (validFrom: string) => {
    return new Date(validFrom) > new Date()
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (response.ok) {
        // Only get CUSTOMER role users who are not banned
        const customers = (data.users || []).filter((u: User) => u.role === 'CUSTOMER' && !u.banned)
        setUsers(customers)
      } else {
        toast.error('Không thể tải danh sách khách hàng')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleOpenSendModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setShowSendModal(true)
    setSelectedUserIds([])
    fetchUsers()
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(users.map(u => u.id))
    }
  }

  const handleSendVoucher = async () => {
    if (!selectedVoucher || selectedUserIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khách hàng')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/admin/vouchers/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: selectedVoucher.id,
          userIds: selectedUserIds
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send voucher')
      }

      toast.success(`Đã gửi mã giảm giá cho ${data.successCount} khách hàng!`)
      setShowSendModal(false)
      setSelectedVoucher(null)
      setSelectedUserIds([])
    } catch (error: any) {
      console.error('Error sending voucher:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi gửi mã giảm giá')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Voucher</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý mã giảm giá</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo voucher mới
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã voucher *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: GIAMGIA50"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Mô tả chi tiết về voucher..."
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giảm giá *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="PERCENTAGE">Phần trăm (%)</option>
                  <option value="FIXED_AMOUNT">Số tiền cố định (đ)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị giảm giá * {formData.discountType === 'PERCENTAGE' ? '(%)' : '(VNĐ)'}
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '50000'}
                  required
                  min="0"
                  max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
                  step={formData.discountType === 'PERCENTAGE' ? '1' : '1000'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Min Order Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="100000"
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Max Discount (for percentage) */}
                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giảm tối đa (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="100000"
                      min="0"
                      step="1000"
                    />
                  </div>
                )}
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng sử dụng
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="100 (để trống = không giới hạn)"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Valid From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bắt đầu *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Valid Until */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kết thúc *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Kích hoạt voucher
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Cập nhật' : 'Tạo voucher'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {vouchers.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có voucher nào</p>
            <p className="text-sm text-gray-500 mt-1">Tạo voucher đầu tiên ngay!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời hạn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sử dụng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{voucher.code}</div>
                        {voucher.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">{voucher.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {voucher.discountType === 'PERCENTAGE' ? (
                          <>
                            <Percent className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-600">{voucher.discountValue}%</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-600">
                              {formatPrice(voucher.discountValue)}
                            </span>
                          </>
                        )}
                      </div>
                      {voucher.minOrderValue && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tối thiểu: {formatPrice(voucher.minOrderValue)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-600">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(voucher.validFrom)}
                        </div>
                        <div className="text-gray-600 mt-1">
                          đến {formatDate(voucher.validUntil)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">
                          {voucher.usedCount} / {voucher.usageLimit || '∞'}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {voucher._count?.orders || 0} đơn hàng
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!voucher.active ? (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          Tắt
                        </span>
                      ) : isExpired(voucher.validUntil) ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Hết hạn
                        </span>
                      ) : isUpcoming(voucher.validFrom) ? (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                          Sắp diễn ra
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenSendModal(voucher)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Gửi cho khách hàng"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(voucher)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Voucher Modal */}
      {showSendModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gửi mã giảm giá cho khách hàng</h2>
                <p className="text-sm text-gray-600 mt-1">Mã: <span className="font-semibold text-green-600">{selectedVoucher.code}</span></p>
              </div>
              <button
                onClick={() => {
                  setShowSendModal(false)
                  setSelectedVoucher(null)
                  setSelectedUserIds([])
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Tag className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Voucher Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-bold text-xl text-green-900">{selectedVoucher.code}</p>
                    {selectedVoucher.description && (
                      <p className="text-sm text-gray-600">{selectedVoucher.description}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Giảm giá:</p>
                    <p className="font-semibold text-green-700">
                      {selectedVoucher.discountType === 'PERCENTAGE'
                        ? `${selectedVoucher.discountValue}%`
                        : formatPrice(selectedVoucher.discountValue)
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Đơn tối thiểu:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedVoucher.minOrderValue ? formatPrice(selectedVoucher.minOrderValue) : 'Không giới hạn'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hiệu lực:</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedVoucher.validFrom)} - {formatDate(selectedVoucher.validUntil)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số lượng còn lại:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedVoucher.usageLimit ? selectedVoucher.usageLimit - selectedVoucher.usedCount : '∞'}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Chọn khách hàng ({selectedUserIds.length} / {users.length})
                  </h3>
                  <button
                    onClick={toggleSelectAllUsers}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedUserIds.length === users.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Không có khách hàng nào</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg max-h-[400px] overflow-y-auto">
                    {users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {selectedUserIds.includes(user.id) && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSendVoucher}
                  disabled={sending || selectedUserIds.length === 0}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi cho {selectedUserIds.length} khách hàng
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSendModal(false)
                    setSelectedVoucher(null)
                    setSelectedUserIds([])
                  }}
                  disabled={sending}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
