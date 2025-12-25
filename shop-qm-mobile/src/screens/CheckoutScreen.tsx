import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/helpers'

export default function CheckoutScreen({ navigation }: any) {
  const items = useCartStore((state) => state.items)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const [checkoutItemIds, setCheckoutItemIds] = useState<string[]>([])

  // Load selected item IDs from AsyncStorage
  useEffect(() => {
    const loadCheckoutItems = async () => {
      try {
        const storedIds = await AsyncStorage.getItem('checkoutItemIds')
        if (storedIds) {
          const ids = JSON.parse(storedIds)
          setCheckoutItemIds(ids)
        } else {
          // If no items selected, go back to cart
          navigation.goBack()
        }
      } catch (error) {
        console.error('Error loading checkout items:', error)
        navigation.goBack()
      }
    }
    loadCheckoutItems()
  }, [])

  // Filter to only include selected items
  const checkoutItems = items.filter((item) => checkoutItemIds.includes(item.product.id))

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // Calculate total for selected items only
  const getSelectedTotal = () => {
    return checkoutItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const handleCheckout = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin!')
      return
    }

    const total = getSelectedTotal()
    const grandTotal = total + shipping

    Alert.alert(
      'Xác nhận đặt hàng',
      `Tổng tiền: ${formatPrice(grandTotal)}\nPhương thức: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt hàng',
          onPress: async () => {
            // TODO: Call API to create order

            // Remove only checked out items from cart (not all items)
            for (const item of checkoutItems) {
              await removeFromCart(item.product.id)
            }

            // Clear AsyncStorage
            await AsyncStorage.removeItem('checkoutItemIds')

            Alert.alert('Thành công', 'Đặt hàng thành công!', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Home'),
              },
            ])
          },
        },
      ]
    )
  }

  const total = getSelectedTotal()
  const shipping = 30000
  const grandTotal = total + shipping

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đơn hàng ({checkoutItems.length} sản phẩm)</Text>
        {checkoutItems.map((item) => (
          <View key={item.product.id} style={styles.orderItem}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>
              {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin người nhận</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ tên *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ tên"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ nhận hàng"
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chú thêm (nếu có)"
            multiline
            numberOfLines={2}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('cod')}
        >
          <View style={styles.paymentLeft}>
            <Ionicons name="cash-outline" size={24} color="#DC2626" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Thanh toán khi nhận hàng</Text>
              <Text style={styles.paymentDesc}>Thanh toán bằng tiền mặt khi nhận hàng</Text>
            </View>
          </View>
          <Ionicons
            name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={paymentMethod === 'cod' ? '#DC2626' : '#9CA3AF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'transfer' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('transfer')}
        >
          <View style={styles.paymentLeft}>
            <Ionicons name="card-outline" size={24} color="#DC2626" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Chuyển khoản ngân hàng</Text>
              <Text style={styles.paymentDesc}>Thanh toán qua chuyển khoản</Text>
            </View>
          </View>
          <Ionicons
            name={paymentMethod === 'transfer' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={paymentMethod === 'transfer' ? '#DC2626' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>

      {/* Price Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tạm tính</Text>
          <Text style={styles.priceValue}>{formatPrice(total)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Phí vận chuyển</Text>
          <Text style={styles.priceValue}>{formatPrice(shipping)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>

    {/* Bottom Bar */}
    <View style={styles.bottomBar}>
      <View style={styles.bottomLeft}>
        <Text style={styles.bottomLabel}>Tổng thanh toán</Text>
        <Text style={styles.bottomTotal}>{formatPrice(grandTotal)}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Đặt hàng</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  bottomPadding: {
    height: 80,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  checkoutButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 16,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
