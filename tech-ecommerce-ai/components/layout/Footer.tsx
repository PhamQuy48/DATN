import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Tet Decoration Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
      <div className="absolute top-4 left-4 text-3xl opacity-20">🏮</div>
      <div className="absolute top-4 right-4 text-3xl opacity-20">🏮</div>

      <div className="container-custom py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">SHOP QM</span>
            </Link>
            <p className="text-sm mb-4">
              Nền tảng thương mại điện tử công nghệ thông minh với AI,
              mang đến trải nghiệm mua sắm tuyệt vời nhất.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?category=laptop" className="hover:text-primary-400 transition-colors">Laptop</Link></li>
              <li><Link href="/products?category=smartphone" className="hover:text-primary-400 transition-colors">Điện thoại</Link></li>
              <li><Link href="/products?category=tablet" className="hover:text-primary-400 transition-colors">Tablet</Link></li>
              <li><Link href="/products?category=accessory" className="hover:text-primary-400 transition-colors">Phụ kiện</Link></li>
              <li><Link href="/deals" className="hover:text-primary-400 transition-colors">Khuyến mãi</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Liên hệ</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-400 transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link href="/returns" className="hover:text-primary-400 transition-colors">Đổi trả & Hoàn tiền</Link></li>
              <li><Link href="/warranty" className="hover:text-primary-400 transition-colors">Bảo hành</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>K45/33 Đường K20, Quận Ngũ Hành Sơn, TP. Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:0376004203" className="hover:text-primary-400 transition-colors">
                  0376 004 203
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:anhquy20348@gmail.com" className="hover:text-primary-400 transition-colors">
                  anhquy20348@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 SHOP QM. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
