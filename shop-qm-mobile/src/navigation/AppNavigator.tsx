import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../store/authStore'

// Import screens (will create these next)
import HomeScreen from '../screens/HomeScreenFinal'
import ProductsScreen from '../screens/ProductsScreenFixed'
import ProductDetailScreen from '../screens/ProductDetailScreenFixed'
import CartScreen from '../screens/CartScreen'
import WishlistScreen from '../screens/WishlistScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import UserInfoScreen from '../screens/UserInfoScreen'
import OrdersScreen from '../screens/OrdersScreen'
import AddressScreen from '../screens/AddressScreen'
import SettingsScreen from '../screens/SettingsScreen'
import HelpScreen from '../screens/HelpScreen'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  const itemsCount = useCartStore((state) => state.getItemsCount())
  const wishlistCount = useWishlistStore((state) => state.items.length)

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Sản phẩm',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarLabel: 'Yêu thích',
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Giỏ hàng',
          tabBarBadge: itemsCount > 0 ? itemsCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#DC2626',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ title: 'Chi tiết sản phẩm' }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: 'Thanh toán' }}
            />
            <Stack.Screen
              name="UserInfo"
              component={UserInfoScreen}
              options={{ title: 'Thông tin cá nhân' }}
            />
            <Stack.Screen
              name="Orders"
              component={OrdersScreen}
              options={{ title: 'Đơn hàng của tôi' }}
            />
            <Stack.Screen
              name="Address"
              component={AddressScreen}
              options={{ title: 'Địa chỉ giao hàng' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Cài đặt' }}
            />
            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ title: 'Trợ giúp & Hỗ trợ' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Đăng ký' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
