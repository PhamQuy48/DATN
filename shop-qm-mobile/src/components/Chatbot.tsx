import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { chatAPI, ChatMessage } from '../api/chat'
import { Product } from '../types'
import { formatPrice, getFirstImage } from '../utils/helpers'

interface ChatbotProps {
  visible: boolean
  onClose: () => void
  navigation: any
}

interface Message extends ChatMessage {
  products?: Product[]
}

const quickSuggestions = [
  { icon: '💻', text: 'Laptop gaming tốt nhất', query: 'Tôi muốn tìm laptop gaming mạnh nhất' },
  { icon: '📱', text: 'iPhone mới nhất', query: 'iPhone mới nhất giá bao nhiêu?' },
  { icon: '💰', text: 'Sản phẩm dưới 20 triệu', query: 'Gợi ý sản phẩm dưới 20 triệu' },
  { icon: '⭐', text: 'Sản phẩm hot nhất', query: 'Sản phẩm nào đang hot nhất?' },
]

export default function Chatbot({ visible, onClose, navigation }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của Thế Giới Công Nghệ.\n\nTôi có thể giúp bạn:\n• Tìm sản phẩm phù hợp 💻\n• So sánh giá và tính năng 📊\n• Gợi ý theo ngân sách 💰\n\nBạn cần tìm gì hôm nay?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollViewRef = useRef<ScrollView>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      fadeAnim.setValue(0)
    }
  }, [visible])

  useEffect(() => {
    // Auto scroll to bottom when new message
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const messageText = input.trim()
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await chatAPI.sendMessage(messageText, messages)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        products: response.products,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại. 😊',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: typeof quickSuggestions[0]) => {
    setInput(suggestion.query)
  }

  const handleProductPress = (productId: string) => {
    onClose()
    navigation.navigate('ProductDetail', { productId })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.botIcon}>
              <Ionicons name="sparkles" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>Tư vấn thông minh 24/7</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <Animated.View
              key={index}
              style={[styles.messageWrapper, { opacity: fadeAnim }]}
            >
              <View
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.assistantAvatar}>
                    <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user'
                      ? styles.userBubble
                      : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {message.content}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      message.role === 'user' ? styles.userTimeText : styles.assistantTimeText,
                    ]}
                  >
                    {message.timestamp && formatTime(message.timestamp)}
                  </Text>
                </View>

                {message.role === 'user' && (
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={20} color="#fff" />
                  </View>
                )}
              </View>

              {/* Product Suggestions */}
              {message.products && message.products.length > 0 && (
                <View style={styles.productsContainer}>
                  {message.products.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productCard}
                      onPress={() => handleProductPress(product.id)}
                    >
                      <Image
                        source={{ uri: getFirstImage(product.images) }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      {product.salePrice && product.salePrice < product.price && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>
                            -{Math.round((1 - product.salePrice / product.price) * 100)}%
                          </Text>
                        </View>
                      )}
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>
                            {formatPrice(product.salePrice || product.price)}
                          </Text>
                          {product.salePrice && (
                            <Text style={styles.originalPrice}>
                              {formatPrice(product.price)}
                            </Text>
                          )}
                        </View>
                        {product.rating && (
                          <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color="#FCD34D" />
                            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                            {product.sold && (
                              <Text style={styles.soldText}>• Đã bán {product.sold}</Text>
                            )}
                          </View>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Animated.View>
          ))}

          {loading && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <View style={styles.assistantAvatar}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <ActivityIndicator size="small" color="#DC2626" />
                <Text style={styles.loadingText}>Đang suy nghĩ...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestions */}
        {showSuggestions && messages.length <= 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Gợi ý nhanh:</Text>
            <View style={styles.suggestionsGrid}>
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionClick(suggestion)}
                >
                  <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi của bạn..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: '#DC2626',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FEE2E2',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: '#DC2626',
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#111827',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimeText: {
    color: '#FEE2E2',
  },
  assistantTimeText: {
    color: '#9CA3AF',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  productsContainer: {
    marginLeft: 44,
    marginTop: 8,
    gap: 8,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  soldText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  suggestionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  suggestionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    color: '#111827',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
})
