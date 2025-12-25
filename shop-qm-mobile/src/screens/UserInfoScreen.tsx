import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../store/authStore'

export default function UserInfoScreen({ navigation }: any) {
  const { user } = useAuthStore()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên')
      return
    }

    setLoading(true)
    try {
      // TODO: Call API to update user info
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!')
      navigation.goBack()
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Email (readonly) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputContainer, styles.inputDisabled]}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputDisabledText]}
              value={email}
              editable={false}
            />
          </View>
          <Text style={styles.helperText}>Email không thể thay đổi</Text>
        </View>

        {/* Phone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Role Badge */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vai trò</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name={user?.role === 'ADMIN' ? 'shield-checkmark' : 'person'}
              size={20}
              color="#DC2626"
            />
            <Text style={styles.roleText}>
              {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
        <Text style={styles.infoText}>
          Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và cải thiện trải nghiệm mua sắm.
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
  form: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 14,
  },
  inputDisabledText: {
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    marginTop: 16,
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
