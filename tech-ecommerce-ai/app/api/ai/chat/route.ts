import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Shop information context
const SHOP_INFO = {
  name: 'Thế Giới Công Nghệ',
  description: 'Cửa hàng công nghệ hàng đầu Việt Nam',
  policies: {
    shipping: 'Giao hàng toàn quốc 2-3 ngày. Miễn phí ship đơn từ 500k. Ship COD toàn quốc.',
    payment: 'Thanh toán COD, chuyển khoản, thẻ tín dụng, ví điện tử.',
    warranty: 'Bảo hành chính hãng 12-24 tháng. Đổi trả trong 7 ngày nếu có lỗi.',
    return: 'Đổi trả miễn phí trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả.',
  },
  contact: {
    hotline: '1900 xxxx',
    email: 'support@shopqm.vn',
    address: 'Việt Nam',
  },
}

// Analyze user intent from message
function analyzeIntent(message: string) {
  const lower = message.toLowerCase()

  return {
    // Product queries
    askingAboutProduct: /laptop|điện thoại|phone|iphone|samsung|tablet|ipad|tai nghe|headphone|airpods|watch|đồng hồ|phụ kiện|macbook|asus|dell|hp|lenovo|xiaomi|oppo|vivo/.test(lower),
    askingAboutPrice: /giá|bao nhiêu|tiền|rẻ|đắt|ngân sách|budget|\d+\s*(triệu|tr|trieu|k|nghìn|nghin)/.test(lower),
    askingAboutPromotion: /khuyến mãi|giảm giá|sale|flash sale|deal|ưu đãi|promotion/.test(lower),
    askingAboutStock: /còn hàng|hết hàng|tồn kho|stock|sẵn|available/.test(lower),
    askingAboutSpec: /cấu hình|thông số|specs|ram|cpu|chip|pin|battery|camera|màn hình|screen/.test(lower),

    // Policy queries
    askingAboutShipping: /giao hàng|ship|vận chuyển|delivery|phí ship|miễn phí/.test(lower),
    askingAboutPayment: /thanh toán|payment|cod|chuyển khoản|thẻ|visa|momo/.test(lower),
    askingAboutWarranty: /bảo hành|warranty|đổi trả|return|hoàn tiền/.test(lower),

    // Comparison
    askingComparison: /so sánh|compare|khác|giống|tốt hơn|vs|hay hơn/.test(lower),

    // Recommendation
    askingRecommendation: /gợi ý|recommend|nên|chọn|tư vấn|advice/.test(lower),
  }
}

// Build smart database query based on intent
async function getRelevantProducts(message: string, intent: any) {
  const lower = message.toLowerCase()

  // Extract price range if mentioned
  let priceMin = 0
  let priceMax = 999999999
  const priceMatch = lower.match(/(\d+)\s*(triệu|tr|trieu)/)
  if (priceMatch) {
    const amount = parseInt(priceMatch[1]) * 1000000
    priceMin = amount * 0.8 // -20%
    priceMax = amount * 1.2 // +20%
  }

  // Build query filters
  const where: any = {
    stock: { gt: 0 }, // Only in-stock products
  }

  // Filter by category
  if (lower.includes('laptop') || lower.includes('máy tính')) {
    where.category = { slug: 'laptop' }
  } else if (lower.includes('điện thoại') || lower.includes('phone')) {
    where.category = { slug: 'smartphone' }
  } else if (lower.includes('tablet') || lower.includes('ipad')) {
    where.category = { slug: 'tablet' }
  } else if (lower.includes('tai nghe') || lower.includes('headphone') || lower.includes('airpods')) {
    where.category = { name: { contains: 'Tai nghe' } }
  } else if (lower.includes('watch') || lower.includes('đồng hồ')) {
    where.category = { name: { contains: 'Smartwatch' } }
  }

  // Filter by brand
  if (lower.includes('apple')) {
    where.brand = 'Apple'
  } else if (lower.includes('samsung')) {
    where.brand = 'Samsung'
  } else if (lower.includes('xiaomi')) {
    where.brand = 'Xiaomi'
  } else if (lower.includes('asus')) {
    where.brand = 'ASUS'
  } else if (lower.includes('dell')) {
    where.brand = 'Dell'
  } else if (lower.includes('hp')) {
    where.brand = 'HP'
  } else if (lower.includes('lenovo')) {
    where.brand = 'Lenovo'
  }

  // Filter by price range
  if (priceMatch) {
    where.OR = [
      { price: { gte: priceMin, lte: priceMax } },
      { salePrice: { gte: priceMin, lte: priceMax } },
    ]
  }

  // Filter by promotion
  if (intent.askingAboutPromotion) {
    where.salePrice = { not: null }
  }

  // Sort order
  let orderBy: any = [
    { featured: 'desc' },
    { sold: 'desc' },
    { rating: 'desc' },
  ]

  if (intent.askingAboutPrice && lower.includes('rẻ')) {
    orderBy = [{ price: 'asc' }]
  } else if (intent.askingAboutPromotion) {
    orderBy = [{ salePrice: 'asc' }]
  }

  // Execute query
  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy,
    take: 50,
  })

  // Process products
  return products.map((p: any) => {
    const hasDiscount = p.salePrice && p.salePrice < p.price
    const discountPercent = hasDiscount && p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0
    const finalPrice = p.salePrice || p.price

    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category.name,
      price: p.price,
      salePrice: p.salePrice,
      finalPrice,
      discount: discountPercent,
      description: p.description,
      specs: p.specs,
      rating: p.rating,
      sold: p.sold,
      stock: p.stock,
      featured: p.featured,
      images: p.images ? (p.images as string).split(',').map(img => img.trim()) : [],
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body.message
    const conversationHistory = body.conversationHistory || []

    console.log('📩 User question:', message)

    // Check API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      throw new Error('No valid Gemini API key')
    }

    // Analyze user intent
    const intent = analyzeIntent(message)
    console.log('🧠 Intent analysis:', intent)

    // Get relevant products from database based on intent
    const products = await getRelevantProducts(message, intent)
    console.log(`📦 Found ${products.length} relevant products from database`)

    // Get statistics for context
    const allProducts = await prisma.product.findMany({
      include: { category: true },
    })

    const stats = {
      totalProducts: allProducts.length,
      inStock: allProducts.filter(p => p.stock > 0).length,
      onSale: allProducts.filter(p => p.salePrice && p.salePrice < p.price).length,
      categories: [...new Set(allProducts.map((p: any) => p.category.name))],
      brands: [...new Set(allProducts.map(p => p.brand))],
      priceRange: {
        min: Math.min(...allProducts.map(p => p.salePrice || p.price)),
        max: Math.max(...allProducts.map(p => p.price)),
      },
    }

    // Build conversation context
    const conversationText = conversationHistory
      .slice(-3)
      .map((msg: any) => `${msg.role === 'user' ? 'Khách' : 'Bot'}: ${msg.content}`)
      .join('\n')

    // Build enhanced AI prompt
    const prompt = `Bạn là chuyên viên tư vấn bán hàng thông minh của ${SHOP_INFO.name}.

🏪 THÔNG TIN CỬA HÀNG:
- Tên: ${SHOP_INFO.name} - ${SHOP_INFO.description}
- Tổng sản phẩm: ${stats.totalProducts} (${stats.inStock} còn hàng)
- Đang khuyến mãi: ${stats.onSale} sản phẩm
- Danh mục: ${stats.categories.join(', ')}
- Thương hiệu: ${stats.brands.join(', ')}

📋 CHÍNH SÁCH CỬA HÀNG:
- Giao hàng: ${SHOP_INFO.policies.shipping}
- Thanh toán: ${SHOP_INFO.policies.payment}
- Bảo hành: ${SHOP_INFO.policies.warranty}
- Đổi trả: ${SHOP_INFO.policies.return}

📞 LIÊN HỆ:
- Hotline: ${SHOP_INFO.contact.hotline}
- Email: ${SHOP_INFO.contact.email}

🎯 PHÂN TÍCH CÂU HỎI:
${JSON.stringify(intent, null, 2)}

📦 DỮ LIỆU SẢN PHẨM TỪ DATABASE (${products.length} sản phẩm):
${JSON.stringify(products.slice(0, 10), null, 2)}

💬 LỊCH SỬ HỘI THOẠI:
${conversationText || 'Chưa có'}

❓ CÂU HỎI KHÁCH HÀNG:
"${message}"

📝 HƯỚNG DẪN TRẢ LỜI:

1. **PHÂN TÍCH CÂU HỎI**: Hiểu đúng ý khách hàng muốn gì
2. **SỬ DỤNG DỮ LIỆU**: Chỉ trả lời dựa trên dữ liệu THỰC TẾ từ database ở trên
3. **TRẢ LỜI CHÍNH XÁC**:
   - Nếu hỏi về SẢN PHẨM → Gợi ý 2-3 sản phẩm CỤ THỂ từ database
   - Nếu hỏi về GIÁ → Nêu giá CHÍNH XÁC từ database
   - Nếu hỏi về CHÍNH SÁCH → Trích dẫn chính sách ở trên
   - Nếu hỏi về STOCK → Kiểm tra stock từ database
   - Nếu hỏi về SPECS → Lấy từ trường specs trong database

4. **FORMAT TRẢ LỜI** (BẮT BUỘC):
   - Tối đa 3-4 câu ngắn gọn
   - Gọi TÊN SẢN PHẨM + BRAND + 1 SPEC nổi bật
   - Nêu GIÁ CHÍNH XÁC (nếu có sale thì ghi cả 2)
   - ⚠️ BẮT BUỘC phải kết thúc bằng: [PRODUCTS: id1, id2, id3]
   - ⚠️ Nếu không gợi ý sản phẩm cụ thể → KHÔNG cần [PRODUCTS: ...]

5. **LƯU Ý**:
   - KHÔNG bịa ra sản phẩm không có trong database
   - KHÔNG nêu giá nếu không chắc chắn
   - KHÔNG hứa hẹn điều không có trong chính sách
   - Nếu KHÔNG TÌM THẤY sản phẩm phù hợp → Gợi ý mở rộng hoặc hỏi thêm

✅ VÍ DỤ TRẢ LỜI TỐT:

Hỏi: "Laptop gaming 30 triệu"
Database có: Dell Gaming G15 5530 (id: abc123, giá 32.99tr, sale 28.99tr)
Trả lời: "Chào anh! Với 30tr cho laptop gaming, em gợi ý Dell Gaming G15 5530 🎮 với Core i7-13650HX + RTX 4060. Giá gốc 32.99tr, đang sale còn 28.99tr rất hời ạ!

[PRODUCTS: abc123]"

Hỏi: "Tư vấn laptop học IT"
Database có: ASUS Vivobook 15 (id: xyz789), MacBook Air M2 (id: mac456)
Trả lời: "Chào bạn! Với nhu cầu học IT, em gợi ý 2 mẫu:
1. ASUS Vivobook 15 OLED - Core i5, RAM 16GB, giá 18.99tr
2. MacBook Air M2 - Chip M2 mạnh, pin 18h, giá 28.99tr

[PRODUCTS: xyz789, mac456]"

Hỏi: "Chính sách giao hàng thế nào?"
Trả lời: "Bên em giao hàng toàn quốc 2-3 ngày, MIỄN PHÍ ship cho đơn từ 500k. Có hỗ trợ COD toàn quốc nha anh! 📦"

❌ VÍ DỤ XẤU - TRÁNH:

"Chúng tôi có nhiều laptop..." ← SAI: Không cụ thể
"Tùy vào nhu cầu của bạn..." ← SAI: Lòng vòng
"iPhone 15 Pro Max giá khoảng 30-35tr..." ← SAI: Giá không chính xác

🚀 BẮT ĐẦU TRẢ LỜI (chỉ nội dung, không mở đầu):`

    // Call Gemini AI using REST API directly
    let aiResponse = ''

    try {
      const apiKey = process.env.GEMINI_API_KEY
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            topP: 0.95,
            topK: 40,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      console.log('🤖 AI Response:', aiResponse)
    } catch (geminiError: any) {
      console.error('Gemini API Error:', geminiError.message)
      throw new Error(`Gemini API failed: ${geminiError.message}`)
    }

    // Extract product IDs from response
    const productMatch = aiResponse.match(/\[PRODUCTS:\s*([^\]]+)\]/)
    let suggestedProducts: any[] = []

    if (productMatch) {
      const productIds = productMatch[1].split(',').map(id => id.trim())
      suggestedProducts = products.filter(p => productIds.includes(p.id))
      console.log(`✅ Suggested ${suggestedProducts.length} products`)
    } else if (intent.askingAboutProduct || intent.askingRecommendation) {
      // Fallback: If AI doesn't provide product IDs but it's about products, suggest top 3
      suggestedProducts = products.slice(0, 3)
      console.log(`⚠️ No product IDs in response, suggesting top ${suggestedProducts.length} products as fallback`)
    }

    // Clean response
    const cleanResponse = aiResponse.replace(/\[PRODUCTS:[^\]]+\]/g, '').trim()

    return NextResponse.json({
      message: cleanResponse,
      products: suggestedProducts,
      debug: {
        intent,
        totalProductsFound: products.length,
        suggestedCount: suggestedProducts.length,
      },
    })

  } catch (error: any) {
    console.error('❌ AI Chat Error:', error)

    // Check if database error
    if (error.message?.includes('database') || error.message?.includes('3306')) {
      return NextResponse.json({
        message: '⚠️ Hệ thống đang bảo trì database. Vui lòng thử lại sau ít phút. Xin lỗi anh/chị vì sự bất tiện này! 🙏',
        products: [],
        error: 'DATABASE_ERROR'
      }, { status: 503 })
    }

    // Check if API key error
    if (error.message?.includes('API key') || error.message?.includes('Gemini')) {
      return NextResponse.json({
        message: '⚠️ Hệ thống AI đang cập nhật. Em là nhân viên tư vấn, anh/chị cần tư vấn sản phẩm gì ạ? 😊',
        products: [],
        error: 'API_KEY_ERROR'
      }, { status: 503 })
    }

    // Generic fallback
    return NextResponse.json({
      message: 'Xin lỗi, hệ thống AI đang bận. Em là nhân viên tư vấn, anh/chị cho em biết cần tìm sản phẩm gì ạ? 😊',
      products: [],
      error: 'UNKNOWN_ERROR'
    }, { status: 500 })
  }
}
