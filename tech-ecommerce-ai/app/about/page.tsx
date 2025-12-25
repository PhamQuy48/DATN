import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Sparkles, Target, Users, Award, Heart, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-blue-600 rounded-3xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Về SHOP QM</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng thương mại điện tử công nghệ uy tín,
            mang đến trải nghiệm mua sắm chất lượng và tin cậy
          </p>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl shadow-sm p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              SHOP QM được ra đời từ tầm nhìn tạo ra một nền tảng thương mại điện tử
              hiện đại, nơi chất lượng sản phẩm và trải nghiệm người dùng được đặt lên hàng đầu.
            </p>
            <p className="mb-4">
              Chúng tôi tin rằng việc mua sắm công nghệ không chỉ là giao dịch, mà là
              một hành trình khám phá. Mỗi khách hàng sẽ tìm được
              sản phẩm chính hãng phù hợp nhất với nhu cầu và ngân sách của mình.
            </p>
            <p>
              Từ laptop cao cấp đến phụ kiện thông minh, mỗi sản phẩm đều được tuyển chọn
              kỹ lưỡng để đảm bảo chất lượng và giá trị tốt nhất cho khách hàng.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sáng tạo</h3>
              <p className="text-gray-600">
                Luôn tiên phong ứng dụng công nghệ AI để mang lại trải nghiệm mua sắm tốt nhất
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Khách hàng là trung tâm</h3>
              <p className="text-gray-600">
                Mọi quyết định đều hướng đến lợi ích và sự hài lòng của khách hàng
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chất lượng</h3>
              <p className="text-gray-600">
                Cam kết cung cấp sản phẩm chính hãng với giá cả cạnh tranh nhất
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-12 text-white mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Khách hàng hài lòng</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Sản phẩm</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Đánh giá tích cực</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Đội ngũ của chúng tôi</h2>
          <div className="text-center max-w-3xl mx-auto">
            <Users className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <p className="text-lg text-gray-600 mb-6">
              Chúng tôi là một đội ngũ đam mê công nghệ, luôn nỗ lực để mang đến
              những sản phẩm và dịch vụ tốt nhất cho khách hàng. Với kinh nghiệm
              nhiều năm trong ngành thương mại điện tử và công nghệ, chúng tôi hiểu
              rõ nhu cầu của khách hàng và không ngừng cải tiến để phục vụ tốt hơn.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Đam mê</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Chuyên nghiệp</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Tận tâm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
