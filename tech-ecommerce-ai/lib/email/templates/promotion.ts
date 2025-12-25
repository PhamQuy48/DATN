import { Product } from '@prisma/client'
import { formatPrice } from '@/lib/utils/format'

interface PromotionEmailData {
  customerName: string
  product: Product & {
    category?: { name: string }
  }
  discountPercent: number
  validUntil?: string
}

export function generatePromotionEmail(data: PromotionEmailData): string {
  const { customerName, product, discountPercent, validUntil } = data
  const originalPrice = product.price
  const salePrice = product.salePrice || product.price * (1 - discountPercent / 100)
  const savings = originalPrice - salePrice

  // Parse images if it's a JSON string
  let imageUrl = product.thumbnail
  if (product.images && typeof product.images === 'string') {
    try {
      const imagesArray = JSON.parse(product.images)
      imageUrl = imagesArray[0] || product.thumbnail
    } catch {
      imageUrl = product.thumbnail
    }
  }

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khuyến Mãi Đặc Biệt</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                🎉 KHUYẾN MÃI ĐẶC BIỆT 🎉
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                Dành riêng cho bạn - ${customerName}
              </p>
            </td>
          </tr>

          <!-- Discount Badge -->
          <tr>
            <td style="padding: 0; text-align: center;">
              <div style="background-color: #ff4757; color: #ffffff; display: inline-block; padding: 15px 40px; border-radius: 50px; margin-top: -25px; box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4); font-size: 24px; font-weight: 700;">
                GIẢM ${discountPercent}%
              </div>
            </td>
          </tr>

          <!-- Product Image -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center;">
              <img src="${imageUrl}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            </td>
          </tr>

          <!-- Product Info -->
          <tr>
            <td style="padding: 20px 40px; text-align: center;">
              <h2 style="margin: 0 0 10px; color: #2d3748; font-size: 26px; font-weight: 700;">
                ${product.name}
              </h2>
              ${product.category ? `
                <p style="margin: 0 0 15px; color: #718096; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  ${product.category.name}
                </p>
              ` : ''}
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                ${product.description?.substring(0, 150)}${(product.description?.length || 0) > 150 ? '...' : ''}
              </p>
            </td>
          </tr>

          <!-- Price Section -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; background-color: #f7fafc; border-top: 2px dashed #e2e8f0; border-bottom: 2px dashed #e2e8f0;">
              <div style="margin-bottom: 15px;">
                <span style="color: #a0aec0; font-size: 18px; text-decoration: line-through; margin-right: 10px;">
                  ${formatPrice(originalPrice)}
                </span>
                <span style="color: #e53e3e; font-size: 16px; font-weight: 600;">
                  Tiết kiệm ${formatPrice(savings)}
                </span>
              </div>
              <div style="font-size: 42px; font-weight: 800; color: #2d3748;">
                ${formatPrice(salePrice)}
              </div>
              ${validUntil ? `
                <p style="margin: 15px 0 0; color: #718096; font-size: 14px;">
                  ⏰ Có hiệu lực đến: <strong>${validUntil}</strong>
                </p>
              ` : ''}
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}"
                 style="display: inline-block; padding: 18px 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 700; border-radius: 50px; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                🛒 MUA NGAY
              </a>
              <p style="margin: 20px 0 0; color: #a0aec0; font-size: 13px;">
                Nhấn vào nút bên trên để xem chi tiết sản phẩm
              </p>
            </td>
          </tr>

          <!-- Why Choose Us -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc;">
              <h3 style="margin: 0 0 20px; color: #2d3748; font-size: 20px; font-weight: 700; text-align: center;">
                Tại sao chọn ShopQM?
              </h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; width: 33%; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">✓</div>
                    <div style="color: #4a5568; font-size: 13px; font-weight: 600;">Chính hãng 100%</div>
                  </td>
                  <td style="padding: 10px; width: 33%; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">🚚</div>
                    <div style="color: #4a5568; font-size: 13px; font-weight: 600;">Giao hàng miễn phí</div>
                  </td>
                  <td style="padding: 10px; width: 33%; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">🔒</div>
                    <div style="color: #4a5568; font-size: 13px; font-weight: 600;">Bảo hành chính hãng</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                Email này được gửi đến bạn vì bạn là khách hàng thân thiết của ShopQM
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © ${new Date().getFullYear()} ShopQM. All rights reserved.
              </p>
              <div style="margin-top: 15px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 13px;">Trang chủ</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 13px;">Sản phẩm</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 13px;">Liên hệ</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
