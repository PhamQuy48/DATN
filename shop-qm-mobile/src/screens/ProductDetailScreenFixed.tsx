import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { productsAPI } from '../api/products'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { Product } from '../types'
import { formatPrice, getFirstImage } from '../utils/helpers'

export default function ProductDetailScreenFixed({ route, navigation }: any) {
  const { productId } = route.params
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addToCart = useCartStore((state) => state.addToCart)
  const addToWishlist = useWishlistStore((state) => state.addToWishlist)
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [productId])

  useEffect(() => {
    if (product) {
      setIsFavorite(isInWishlist(product.id))
    }
  }, [product, isInWishlist])

  const loadProduct = async () => {
    try {
      setLoading(true)
      console.log('Loading product:', productId)
      const data = await productsAPI.getById(productId)
      console.log('Product loaded:', data?.name)
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = () => {
    if (!product) return

    if (isFavorite) {
      removeFromWishlist(product.id)
      Alert.alert('Đã xóa', 'Đã xóa khỏi danh sách yêu thích')
    } else {
      addToWishlist(product)
      Alert.alert('Đã thêm', 'Đã thêm vào danh sách yêu thích')
    }
    setIsFavorite(!isFavorite)
  }

  const handleAddToCart = async () => {
    if (!product) return

    if (product.stock < quantity) {
      Alert.alert('Thông báo', 'Số lượng sản phẩm không đủ!')
      return
    }

    await addToCart(product, quantity)
    Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!', [
      { text: 'Tiếp tục mua', style: 'cancel' },
      {
        text: 'Xem giỏ hàng',
        onPress: () => {
          // Navigate to MainTabs -> Cart tab
          navigation.navigate('MainTabs', { screen: 'Cart' })
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getFirstImage(product.images) }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={toggleWishlist}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#DC2626' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}

          <View style={styles.priceContainer}>
            {product.salePrice ? (
              <>
                <Text style={styles.salePrice}>{formatPrice(product.salePrice)}</Text>
                <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            )}
          </View>

          <View style={styles.stockContainer}>
            <Ionicons
              name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={product.stock > 0 ? '#10B981' : '#EF4444'}
            />
            <Text style={[styles.stockText, { color: product.stock > 0 ? '#10B981' : '#EF4444' }]}>
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Số lượng</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={quantity >= product.stock ? '#9CA3AF' : '#111827'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>
            {formatPrice((product.salePrice || product.price) * quantity)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, product.stock === 0 && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={styles.addButtonText}>
            {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  wishlistButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#DC2626',
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  salePrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
