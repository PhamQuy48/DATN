'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ChevronDown, HelpCircle } from 'lucide-react'

type FAQItem = {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'Sản phẩm',
    question: 'Làm sao để biết sản phẩm còn hàng?',
    answer: 'Trên mỗi trang sản phẩm, bạn có thể thấy số lượng còn lại ngay bên dưới nút "Thêm vào giỏ". Nếu sản phẩm hết hàng, nút sẽ hiển thị "Hết hàng" và không thể thêm vào giỏ.',
  },
  {
    category: 'Sản phẩm',
    question: 'Sản phẩm có chính hãng không?',
    answer: 'Tất cả sản phẩm tại SHOP QM đều là hàng chính hãng 100%, có đầy đủ tem, hóa đơn VAT và được bảo hành chính hãng theo quy định của nhà sản xuất.',
  },
  {
    category: 'Đơn hàng',
    question: 'Làm thế nào để đặt hàng?',
    answer: 'Bạn chỉ cần: 1) Chọn sản phẩm và thêm vào giỏ hàng, 2) Vào giỏ hàng và click "Thanh toán", 3) Điền thông tin giao hàng, 4) Chọn phương thức thanh toán và hoàn tất.',
  },
  {
    category: 'Đơn hàng',
    question: 'Tôi có thể hủy đơn hàng không?',
    answer: 'Bạn có thể hủy đơn hàng miễn phí khi đơn hàng chưa được xác nhận (trong vòng 1 giờ sau khi đặt). Sau khi đã xác nhận, vui lòng liên hệ hotline để được hỗ trợ.',
  },
  {
    category: 'Thanh toán',
    question: 'Có những phương thức thanh toán nào?',
    answer: 'Chúng tôi hỗ trợ: Thanh toán khi nhận hàng (COD), Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), Ví MoMo, và Chuyển khoản ngân hàng.',
  },
  {
    category: 'Thanh toán',
    question: 'Thanh toán có an toàn không?',
    answer: 'Hoàn toàn an toàn! Chúng tôi sử dụng công nghệ mã hóa SSL và các cổng thanh toán uy tín như Stripe để bảo vệ thông tin của bạn.',
  },
  {
    category: 'Vận chuyển',
    question: 'Thời gian giao hàng bao lâu?',
    answer: 'Đơn hàng trong nội thành HCM và Hà Nội: 1-2 ngày. Các tỉnh thành khác: 2-5 ngày làm việc tùy khu vực.',
  },
  {
    category: 'Vận chuyển',
    question: 'Phí vận chuyển là bao nhiêu?',
    answer: 'Miễn phí vận chuyển cho đơn hàng từ 10 triệu trở lên. Đơn hàng dưới 10 triệu: phí 30,000đ.',
  },
  {
    category: 'Đổi trả',
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên seal, chưa sử dụng, đầy đủ phụ kiện và hóa đơn.',
  },
  {
    category: 'Đổi trả',
    question: 'Ai chịu phí vận chuyển khi đổi trả?',
    answer: 'Nếu lỗi do nhà sản xuất hoặc chúng tôi giao sai, chúng tôi sẽ chịu phí. Nếu bạn đổi ý hoặc lý do cá nhân, bạn sẽ chịu phí vận chuyển.',
  },
  {
    category: 'Bảo hành',
    question: 'Thời gian bảo hành là bao lâu?',
    answer: 'Tùy sản phẩm: Laptop, điện thoại, tablet thường 12-24 tháng. Phụ kiện 6-12 tháng. Thông tin cụ thể có trên trang sản phẩm.',
  },
  {
    category: 'Bảo hành',
    question: 'Bảo hành ở đâu?',
    answer: 'Tất cả sản phẩm được bảo hành chính hãng tại các trung tâm bảo hành của nhà sản xuất trên toàn quốc. Danh sách trung tâm có trong phiếu bảo hành.',
  },
]

const categories = [...new Set(faqs.map(faq => faq.category))]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFaqs = selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Câu hỏi thường gặp</h1>
          <p className="text-xl text-gray-600">
            Tìm câu trả lời cho những câu hỏi phổ biến nhất
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <div className="text-xs text-primary-600 font-medium mb-1">
                    {faq.category}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {faq.question}
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 animate-slide-up">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy câu trả lời?</h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="btn btn-primary">
              Liên hệ ngay
            </a>
            <button
              onClick={() => {
                const chatButton = document.querySelector('[class*="ChatbotButton"]') as HTMLButtonElement
                chatButton?.click()
              }}
              className="btn btn-secondary"
            >
              Chat với AI Assistant
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
