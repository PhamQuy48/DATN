import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function HelpScreen() {
  const handleContactPress = (type: string) => {
    switch (type) {
      case 'phone':
        Linking.openURL('tel:0123456789')
        break
      case 'email':
        Linking.openURL('mailto:support@shopqm.vn')
        break
      case 'facebook':
        Linking.openURL('https://facebook.com/shopqm')
        break
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Liên hệ hỗ trợ</Text>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress('phone')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={24} color="#DC2626" />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Hotline</Text>
            <Text style={styles.contactValue}>0123 456 789</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress('email')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={24} color="#DC2626" />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactValue}>support@shopqm.vn</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress('facebook')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="logo-facebook" size={24} color="#DC2626" />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Facebook</Text>
            <Text style={styles.contactValue}>facebook.com/shopqm</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Làm thế nào để theo dõi đơn hàng?</Text>
          <Text style={styles.faqAnswer}>
            Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" trên trang cá nhân.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Chính sách đổi trả như thế nào?</Text>
          <Text style={styles.faqAnswer}>
            Sản phẩm được đổi trả trong vòng 7 ngày nếu còn nguyên tem, hộp và chưa qua sử dụng.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Có hỗ trợ trả góp không?</Text>
          <Text style={styles.faqAnswer}>
            Có, chúng tôi hỗ trợ trả góp 0% qua thẻ tín dụng cho đơn hàng từ 3 triệu đồng.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Thời gian giao hàng bao lâu?</Text>
          <Text style={styles.faqAnswer}>
            Đơn hàng trong nội thành được giao trong vòng 2-4 giờ, ngoại thành 1-2 ngày.
          </Text>
        </View>
      </View>

      {/* Working Hours */}
      <View style={styles.infoBox}>
        <Ionicons name="time-outline" size={24} color="#3B82F6" />
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Giờ làm việc</Text>
          <Text style={styles.infoDescription}>
            Thứ 2 - Thứ 7: 8:00 - 22:00{'\n'}
            Chủ nhật: 9:00 - 21:00
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#3B82F6',
    lineHeight: 20,
  },
})
