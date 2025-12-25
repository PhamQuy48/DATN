import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ChatbotButton from '@/components/ai/ChatbotButton'
import SessionProvider from '@/components/providers/SessionProvider'
import TetDecoration from '@/components/decorations/TetDecoration'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SHOP QM - Cửa hàng công nghệ chất lượng',
  description: 'Mua sắm sản phẩm công nghệ chính hãng, giá tốt tại SHOP QM',
  keywords: ['công nghệ', 'laptop', 'smartphone', 'AI', 'thương mại điện tử', 'SHOP QM'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SHOP QM',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#DC2626',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <TetDecoration />
          {children}
          <ChatbotButton />
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}
