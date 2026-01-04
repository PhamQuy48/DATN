import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold mb-4">Đặt hàng thành công!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Cảm ơn bạn đã mua sắm tại Thế Giới Công Nghệ
          </p>

          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 justify-center mb-4">
              <Package className="w-6 h-6 text-primary-600" />
              <p className="text-lg">
                Mã đơn hàng: <span className="font-bold">#TS{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </p>
            </div>
            <p className="text-gray-600">
              Chúng tôi đã gửi email xác nhận đơn hàng đến hộp thư của bạn.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-bold mb-4 text-center">Bước tiếp theo</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Xác nhận đơn hàng</p>
                  <p className="text-sm text-gray-600">
                    Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong 24h
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Đóng gói và giao hàng</p>
                  <p className="text-sm text-gray-600">
                    Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Nhận hàng và thanh toán</p>
                  <p className="text-sm text-gray-600">
                    Kiểm tra hàng và thanh toán khi nhận được sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              Tiếp tục mua sắm
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="btn btn-secondary inline-flex items-center justify-center gap-2"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
