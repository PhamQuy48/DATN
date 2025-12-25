import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <ScrollView style={styles.container}>
      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông báo</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#4B5563" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Thông báo đẩy</Text>
              <Text style={styles.settingDescription}>Nhận thông báo về đơn hàng</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
            thumbColor={notifications ? '#DC2626' : '#F3F4F6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="mail-outline" size={24} color="#4B5563" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Email khuyến mãi</Text>
              <Text style={styles.settingDescription}>Nhận tin khuyến mãi qua email</Text>
            </View>
          </View>
          <Switch
            value={emailUpdates}
            onValueChange={setEmailUpdates}
            trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
            thumbColor={emailUpdates ? '#DC2626' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giao diện</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color="#4B5563" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Chế độ tối</Text>
              <Text style={styles.settingDescription}>Bật giao diện tối</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
            thumbColor={darkMode ? '#DC2626' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Other Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Khác</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={24} color="#4B5563" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Ngôn ngữ</Text>
              <Text style={styles.settingDescription}>Tiếng Việt</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield-outline" size={24} color="#4B5563" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Quyền riêng tư</Text>
              <Text style={styles.settingDescription}>Quản lý quyền riêng tư</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>SHOP QM Mobile v1.0.0</Text>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appVersion: {
    fontSize: 14,
    color: '#9CA3AF',
  },
})
