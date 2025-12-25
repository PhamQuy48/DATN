import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../store/authStore'
import { API_URL } from '../api/config'

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'REFUNDING' | 'CANCELLED'
type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  totalAmount: number
  shippingFee: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

export default function OrdersScreen() {
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const handleCancelOrder = (orderId: string, orderNumber: string, paymentStatus: PaymentStatus) => {
    // Check if order was paid or not
    const isPaid = paymentStatus === 'PAID'
    const newStatus = isPaid ? 'REFUNDING' : 'CANCELLED'

    const alertMessage = isPaid
      ? `Bạn có chắc muốn hủy đơn hàng #${orderNumber}?\n\nĐơn hàng đã thanh toán sẽ được chuyển sang trạng thái "Đang hoàn tiền" và chúng tôi sẽ xử lý hoàn tiền trong thời gian sớm nhất.`
      : `Bạn có chắc muốn hủy đơn hàng #${orderNumber}?\n\nĐơn hàng chưa thanh toán (COD) sẽ bị hủy ngay lập tức.`

    Alert.alert(
      'Hủy đơn hàng',
      alertMessage,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy đơn',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
              })

              if (response.ok) {
                const successMessage = isPaid
                  ? 'Yêu cầu hoàn tiền đã được gửi! Chúng tôi sẽ hoàn tiền cho bạn sớm nhất.'
                  : 'Đơn hàng đã được hủy thành công!'
                Alert.alert('Thành công', successMessage)
                fetchOrders() // Refresh orders
              } else {
                const errorData = await response.json()
                Alert.alert('Lỗi', errorData.error || 'Không thể hủy đơn hàng')
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Có lỗi xảy ra')
            }
          },
        },
      ]
    )
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'PROCESSING':
        return 'Đang xử lý'
      case 'SHIPPING':
        return 'Đang giao'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'REFUNDING':
        return 'Đang hoàn tiền'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return '#F59E0B'
      case 'PROCESSING':
        return '#3B82F6'
      case 'SHIPPING':
        return '#8B5CF6'
      case 'COMPLETED':
        return '#10B981'
      case 'REFUNDING':
        return '#F97316'
      case 'CANCELLED':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'time-outline'
      case 'PROCESSING':
        return 'cube-outline'
      case 'SHIPPING':
        return 'bicycle-outline'
      case 'COMPLETED':
        return 'checkmark-circle'
      case 'REFUNDING':
        return 'cash-outline'
      case 'CANCELLED':
        return 'close-circle'
      default:
        return 'help-outline'
    }
  }

  const canCancelOrder = (status: OrderStatus) => {
    return status === 'PENDING' || status === 'PROCESSING'
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
          <Text style={styles.emptyText}>
            Các đơn hàng của bạn sẽ xuất hiện ở đây sau khi đặt hàng
          </Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <Text style={styles.headerSubtitle}>{orders.length} đơn hàng</Text>
      </View>

      <View style={styles.ordersList}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(order.status)}20` },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(order.status) as any}
                  size={16}
                  color={getStatusColor(order.status)}
                />
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            {/* Order Details */}
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <Text style={styles.detailText}>{order.customerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={20} color="#6B7280" />
                <Text style={styles.detailText}>{order.customerPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {order.shippingAddress}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={20} color="#6B7280" />
                <Text style={styles.detailText}>{order.items.length} sản phẩm</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={20} color="#6B7280" />
                <Text style={[styles.detailText, { fontWeight: 'bold', color: '#DC2626' }]}>
                  {order.totalAmount.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.orderFooter}>
              {canCancelOrder(order.status) && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelOrder(order.id, order.orderNumber, order.paymentStatus)}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                  <Text style={styles.cancelButtonText}>Hủy đơn</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
        <Text style={styles.infoText}>
          Bạn có thể theo dõi trạng thái đơn hàng và yêu cầu hỗ trợ nếu cần thiết.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  ordersList: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#374151',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
})
