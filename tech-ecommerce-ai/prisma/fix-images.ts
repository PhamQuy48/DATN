import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Placeholder images from working CDN URLs
const PLACEHOLDER_IMAGES = {
  phone: [
    'https://images.unsplash.com/photo-1592286927505-b0b8bb2d0e43?w=600',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    'https://images.unsplash.com/photo-1585789575858-b0d8ff8e6b09?w=600',
  ],
  headphone: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600',
  ],
  tv: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600',
    'https://images.unsplash.com/photo-1593078165821-ad1e7c2a7c44?w=600',
  ],
  accessory: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
  ],
}

async function fixImages() {
  console.log('🔧 Fixing product images...\n')

  const products = await prisma.product.findMany({
    include: { category: true },
  })

  for (const product of products) {
    let imageUrls: string[] = []

    // Determine category type and assign appropriate placeholder
    const categorySlug = product.category?.slug || ''

    if (categorySlug.includes('dien-thoai')) {
      imageUrls = PLACEHOLDER_IMAGES.phone
    } else if (categorySlug.includes('laptop')) {
      imageUrls = PLACEHOLDER_IMAGES.laptop
    } else if (categorySlug.includes('tablet')) {
      imageUrls = PLACEHOLDER_IMAGES.tablet
    } else if (categorySlug.includes('tai-nghe')) {
      imageUrls = PLACEHOLDER_IMAGES.headphone
    } else if (categorySlug.includes('smartwatch')) {
      imageUrls = PLACEHOLDER_IMAGES.watch
    } else if (categorySlug.includes('tivi')) {
      imageUrls = PLACEHOLDER_IMAGES.tv
    } else if (categorySlug.includes('phu-kien')) {
      imageUrls = PLACEHOLDER_IMAGES.accessory
    } else {
      imageUrls = PLACEHOLDER_IMAGES.phone // default
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: imageUrls.join(','),
        thumbnail: imageUrls[0],
      },
    })

    console.log(`✓ Updated: ${product.name}`)
  }

  console.log('\n✅ All product images have been fixed!')
  console.log('📸 Using high-quality Unsplash images as placeholders')
}

fixImages()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
