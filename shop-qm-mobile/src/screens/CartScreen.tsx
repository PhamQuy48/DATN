import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCartStore } from '../store/cartStore'
import { CartItem } from '../types'

export default function CartScreen({ navigation }: any) {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const getFirstImage = (images: string) => {
    try {
      const imageArray = JSON.parse(images)
      return imageArray[0] || 'https://via.placeholder.com/100'
    } catch {
      return images || 'https://via.placeholder.com/100'
    }
  }

  const handleRemove = (productId: string, productName: string) => {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => removeFromCart(productId) },
      ]
    )
  }

  // Toggle select single item
  const toggleSelectItem = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((item) => item.product.id))
    }
  }

  // Get selected items
  const selectedItems = items.filter((item) => selectedIds.includes(item.product.id))

  // Calculate total for selected items only
  const getSelectedTotal = () => {
    return selectedItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán!')
      return
    }

    // Save selected IDs to AsyncStorage for checkout screen
    await AsyncStorage.setItem('checkoutItemIds', JSON.stringify(selectedIds))
    navigation.navigate('Checkout')
  }

  const handleClearCart = () => {
    Alert.alert('Xóa giỏ hàng', 'Bạn có chắc muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: clearCart },
    ])
  }

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const price = item.product.salePrice || item.product.price
    const isSelected = selectedIds.includes(item.product.id)

    return (
      <View style={[styles.cartItem, isSelected && styles.cartItemSelected]}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => toggleSelectItem(item.product.id)}
          style={styles.checkbox}
        >
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={isSelected ? '#DC2626' : '#9CA3AF'}
          />
        </TouchableOpacity>

        <Image
          source={{ uri: getFirstImage(item.product.images) }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(price)}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.product.id, item.product.name)}
        >
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    )
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
        <Text style={styles.emptyText}>Thêm sản phẩm vào giỏ hàng để tiếp tục</Text>
      </View>
    )
  }

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng ({items.length})</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Select All */}
      <View style={styles.selectAllContainer}>
        <TouchableOpacity
          onPress={toggleSelectAll}
          style={styles.selectAllButton}
        >
          <Ionicons
            name={isAllSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={isAllSelected ? '#DC2626' : '#9CA3AF'}
          />
          <Text style={styles.selectAllText}>
            Chọn tất cả ({selectedIds.length}/{items.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        {selectedIds.length === 0 ? (
          <View style={styles.emptySelectionContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptySelectionText}>Chưa chọn sản phẩm nào</Text>
            <Text style={styles.emptySelectionSubText}>
              Hãy chọn sản phẩm để xem tổng tiền
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>
                Tổng cộng ({selectedIds.length} sản phẩm):
              </Text>
              <Text style={styles.totalPrice}>{formatPrice(getSelectedTotal())}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>
                Thanh toán ({selectedIds.length})
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  clearButton: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  selectAllContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemSelected: {
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  checkbox: {
    padding: 4,
    marginRight: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    minHeight: 120,
  },
  emptySelectionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptySelectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySelectionSubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
