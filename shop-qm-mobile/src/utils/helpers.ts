// Format price to VND currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

// Get first image from product images
export const getFirstImage = (images: any): string => {
  const placeholder = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'

  // Nếu images là null hoặc undefined
  if (!images) return placeholder

  // Nếu images là array
  if (Array.isArray(images)) {
    const firstImage = images[0]
    return firstImage ? convertImageUrl(firstImage) : placeholder
  }

  // Nếu images là string
  if (typeof images === 'string') {
    // Nếu là comma-separated string (VD: "/images/a.jpg,/images/b.jpg")
    if (images.includes(',')) {
      const firstImage = images.split(',')[0].trim()
      return convertImageUrl(firstImage)
    }

    // Thử parse JSON
    try {
      const imageArray = JSON.parse(images)
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        return convertImageUrl(imageArray[0])
      }
    } catch {
      // Không phải JSON, xử lý như URL đơn
    }

    return convertImageUrl(images)
  }

  return placeholder
}

// Convert local image path to Unsplash URL based on product category
const convertImageUrl = (imagePath: string): string => {
  // Nếu đã là URL đầy đủ (http/https), return ngay
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Map local paths to Unsplash images based on keywords
  const path = imagePath.toLowerCase()

  // Laptops
  if (path.includes('laptop')) {
    if (path.includes('asus') || path.includes('rog')) {
      return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
    }
    if (path.includes('msi')) {
      return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
    }
    if (path.includes('dell')) {
      return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
    }
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
  }

  // Phones
  if (path.includes('iphone') || path.includes('phone')) {
    if (path.includes('iphone')) {
      return 'https://images.unsplash.com/photo-1696446702562-56368f5655f5?w=800'
    }
    if (path.includes('samsung')) {
      return 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'
    }
    if (path.includes('xiaomi')) {
      return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
    }
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
  }

  // Tablets
  if (path.includes('ipad') || path.includes('tablet') || path.includes('tab')) {
    if (path.includes('ipad')) {
      return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
    }
    if (path.includes('samsung')) {
      return 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800'
    }
    return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
  }

  // Accessories
  if (path.includes('mouse') || path.includes('chuot')) {
    return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'
  }
  if (path.includes('keyboard') || path.includes('ban-phim') || path.includes('keychron')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
  }
  if (path.includes('headphone') || path.includes('tai-nghe') || path.includes('sony') || path.includes('wh')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
  }

  // Default placeholder
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
}

// Get all images from product
export const getAllImages = (images: any): string[] => {
  const placeholder = ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']

  if (!images) return placeholder

  // Nếu images là array
  if (Array.isArray(images)) {
    return images.length > 0 ? images.map(convertImageUrl) : placeholder
  }

  // Nếu images là string
  if (typeof images === 'string') {
    // Nếu là comma-separated string
    if (images.includes(',')) {
      return images.split(',').map(img => convertImageUrl(img.trim()))
    }

    // Thử parse JSON
    try {
      const imageArray = JSON.parse(images)
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        return imageArray.map(convertImageUrl)
      }
    } catch {
      // Không phải JSON
    }

    return [convertImageUrl(images)]
  }

  return placeholder
}
