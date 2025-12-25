import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User Only
  console.log('👤 Creating admin user...')

  // Plain text password (NOT SECURE - for development only!)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@shopqm.vn',
      password: 'admin123', // Plain text password
      name: 'Admin',
      role: Role.ADMIN,
    },
  })

  console.log(`✅ Created ${admin.name} (${admin.email})`)

  // Create Categories
  console.log('\n📁 Creating categories...')

  const laptopCategory = await prisma.category.create({
    data: {
      name: 'Laptop',
      slug: 'laptop',
      description: 'Laptop gaming, văn phòng, đồ họa chuyên nghiệp',
      image: '/images/categories/laptop.jpg',
    },
  })

  const phoneCategory = await prisma.category.create({
    data: {
      name: 'Điện thoại',
      slug: 'dien-thoai',
      description: 'Smartphone cao cấp, giá tốt',
      image: '/images/categories/phone.jpg',
    },
  })

  const tabletCategory = await prisma.category.create({
    data: {
      name: 'Máy tính bảng',
      slug: 'may-tinh-bang',
      description: 'iPad, Samsung Tab, Surface',
      image: '/images/categories/tablet.jpg',
    },
  })

  const accessoryCategory = await prisma.category.create({
    data: {
      name: 'Phụ kiện',
      slug: 'phu-kien',
      description: 'Chuột, bàn phím, tai nghe, sạc dự phòng',
      image: '/images/categories/accessory.jpg',
    },
  })

  console.log(`✅ Created ${laptopCategory.name}`)
  console.log(`✅ Created ${phoneCategory.name}`)
  console.log(`✅ Created ${tabletCategory.name}`)
  console.log(`✅ Created ${accessoryCategory.name}`)

  // Create Products
  console.log('\n💻 Creating products...')

  // Laptops
  const laptop1 = await prisma.product.create({
    data: {
      name: 'ASUS ROG Strix G16 G614JU-N3135W',
      slug: 'asus-rog-strix-g16-g614ju-n3135w',
      description: 'Laptop gaming ASUS ROG Strix G16 mang đến hiệu năng mạnh mẽ với chip Intel Core i7 Gen 13, card đồ họa NVIDIA RTX 4050, RAM 16GB, SSD 512GB. Màn hình 16 inch Full HD 165Hz cho trải nghiệm gaming mượt mà.',
      price: 32990000,
      salePrice: 29990000,
      brand: 'ASUS',
      categoryId: laptopCategory.id,
      specs: JSON.stringify({
        cpu: 'Intel Core i7-13650HX',
        ram: '16GB DDR5',
        storage: '512GB SSD',
        display: '16" FHD 165Hz',
        gpu: 'NVIDIA RTX 4050 6GB',
        os: 'Windows 11',
      }),
      images: '/images/products/laptop-asus-rog.jpg,/images/products/laptop-asus-rog-2.jpg',
      thumbnail: '/images/products/laptop-asus-rog.jpg',
      stock: 15,
      sku: 'LAPTOP-ASUS-ROG-001',
      sold: 28,
      rating: 4.8,
      reviews: 12,
      featured: true,
    },
  })

  const laptop2 = await prisma.product.create({
    data: {
      name: 'MSI Gaming GF63 Thin 11UC-444VN',
      slug: 'msi-gaming-gf63-thin-11uc-444vn',
      description: 'Laptop gaming MSI GF63 Thin với thiết kế mỏng nhẹ, Intel Core i5 Gen 11, GTX 1650 4GB, RAM 8GB, SSD 512GB. Phù hợp cho game thủ và sinh viên.',
      price: 18990000,
      salePrice: 16990000,
      brand: 'MSI',
      categoryId: laptopCategory.id,
      specs: JSON.stringify({
        cpu: 'Intel Core i5-11400H',
        ram: '8GB DDR4',
        storage: '512GB SSD',
        display: '15.6" FHD 144Hz',
        gpu: 'NVIDIA GTX 1650 4GB',
        os: 'Windows 11',
      }),
      images: '/images/products/laptop-msi-gf63.jpg',
      thumbnail: '/images/products/laptop-msi-gf63.jpg',
      stock: 20,
      sku: 'LAPTOP-MSI-GF63-001',
      sold: 45,
      rating: 4.5,
      reviews: 18,
      featured: true,
    },
  })

  const laptop3 = await prisma.product.create({
    data: {
      name: 'Dell Inspiron 15 3520 N5I5052W',
      slug: 'dell-inspiron-15-3520-n5i5052w',
      description: 'Laptop văn phòng Dell Inspiron 15 với Intel Core i5 Gen 12, RAM 8GB, SSD 512GB. Thiết kế sang trọng, hiệu năng ổn định cho công việc hàng ngày.',
      price: 15990000,
      brand: 'Dell',
      categoryId: laptopCategory.id,
      specs: JSON.stringify({
        cpu: 'Intel Core i5-1235U',
        ram: '8GB DDR4',
        storage: '512GB SSD',
        display: '15.6" FHD',
        gpu: 'Intel Iris Xe Graphics',
        os: 'Windows 11',
      }),
      images: '/images/products/laptop-dell-inspiron.jpg',
      thumbnail: '/images/products/laptop-dell-inspiron.jpg',
      stock: 30,
      sku: 'LAPTOP-DELL-INS-001',
      sold: 62,
      rating: 4.3,
      reviews: 24,
      featured: false,
    },
  })

  // Phones
  const phone1 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max 256GB',
      slug: 'iphone-15-pro-max-256gb',
      description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Dynamic Island 6.7 inch, pin lớn, khung titan cao cấp.',
      price: 34990000,
      salePrice: 32990000,
      brand: 'Apple',
      categoryId: phoneCategory.id,
      specs: JSON.stringify({
        chip: 'Apple A17 Pro',
        ram: '8GB',
        storage: '256GB',
        display: '6.7" Super Retina XDR',
        camera: '48MP + 12MP + 12MP',
        battery: '4422mAh',
      }),
      images: '/images/products/iphone-15-pro-max.jpg',
      thumbnail: '/images/products/iphone-15-pro-max.jpg',
      stock: 25,
      sku: 'PHONE-IPHONE-15PM-256',
      sold: 89,
      rating: 4.9,
      reviews: 45,
      featured: true,
    },
  })

  const phone2 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra 12GB/256GB',
      slug: 'samsung-galaxy-s24-ultra-256gb',
      description: 'Samsung Galaxy S24 Ultra với Snapdragon 8 Gen 3, camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X 6.8 inch.',
      price: 31990000,
      salePrice: 29990000,
      brand: 'Samsung',
      categoryId: phoneCategory.id,
      specs: JSON.stringify({
        chip: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        display: '6.8" Dynamic AMOLED 2X',
        camera: '200MP + 50MP + 12MP + 10MP',
        battery: '5000mAh',
      }),
      images: '/images/products/samsung-s24-ultra.jpg',
      thumbnail: '/images/products/samsung-s24-ultra.jpg',
      stock: 18,
      sku: 'PHONE-SAMSUNG-S24U-256',
      sold: 67,
      rating: 4.8,
      reviews: 38,
      featured: true,
    },
  })

  const phone3 = await prisma.product.create({
    data: {
      name: 'Xiaomi 14 5G 12GB/256GB',
      slug: 'xiaomi-14-5g-256gb',
      description: 'Xiaomi 14 với Snapdragon 8 Gen 3, camera Leica 50MP, sạc nhanh 90W, màn hình AMOLED 6.36 inch 120Hz.',
      price: 19990000,
      salePrice: 17990000,
      brand: 'Xiaomi',
      categoryId: phoneCategory.id,
      specs: JSON.stringify({
        chip: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        display: '6.36" AMOLED 120Hz',
        camera: '50MP Leica + 50MP + 50MP',
        battery: '4610mAh',
      }),
      images: '/images/products/xiaomi-14.jpg',
      thumbnail: '/images/products/xiaomi-14.jpg',
      stock: 22,
      sku: 'PHONE-XIAOMI-14-256',
      sold: 54,
      rating: 4.6,
      reviews: 29,
      featured: false,
    },
  })

  // Tablets
  const tablet1 = await prisma.product.create({
    data: {
      name: 'iPad Pro M2 11 inch WiFi 128GB',
      slug: 'ipad-pro-m2-11-128gb',
      description: 'iPad Pro với chip M2, màn hình Liquid Retina 11 inch, hỗ trợ Apple Pencil Gen 2, Magic Keyboard.',
      price: 22990000,
      salePrice: 21490000,
      brand: 'Apple',
      categoryId: tabletCategory.id,
      specs: JSON.stringify({
        chip: 'Apple M2',
        ram: '8GB',
        storage: '128GB',
        display: '11" Liquid Retina',
        camera: '12MP + 10MP',
        battery: '28.65Wh',
      }),
      images: '/images/products/ipad-pro-m2.jpg',
      thumbnail: '/images/products/ipad-pro-m2.jpg',
      stock: 12,
      sku: 'TABLET-IPAD-M2-128',
      sold: 34,
      rating: 4.9,
      reviews: 16,
      featured: true,
    },
  })

  const tablet2 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy Tab S9+ WiFi 12GB/256GB',
      slug: 'samsung-galaxy-tab-s9-plus-256gb',
      description: 'Samsung Galaxy Tab S9+ với Snapdragon 8 Gen 2, màn hình Dynamic AMOLED 2X 12.4 inch, S Pen đi kèm.',
      price: 25990000,
      salePrice: 23990000,
      brand: 'Samsung',
      categoryId: tabletCategory.id,
      specs: JSON.stringify({
        chip: 'Snapdragon 8 Gen 2',
        ram: '12GB',
        storage: '256GB',
        display: '12.4" Dynamic AMOLED 2X',
        camera: '13MP + 8MP',
        battery: '10090mAh',
      }),
      images: '/images/products/samsung-tab-s9-plus.jpg',
      thumbnail: '/images/products/samsung-tab-s9-plus.jpg',
      stock: 10,
      sku: 'TABLET-SAMSUNG-S9P-256',
      sold: 21,
      rating: 4.7,
      reviews: 11,
      featured: false,
    },
  })

  // Accessories
  const accessory1 = await prisma.product.create({
    data: {
      name: 'Chuột Gaming Logitech G502 HERO',
      slug: 'chuot-logitech-g502-hero',
      description: 'Chuột gaming Logitech G502 HERO với sensor HERO 25K, 11 nút lập trình, đèn RGB, trọng lượng có thể điều chỉnh.',
      price: 1290000,
      salePrice: 990000,
      brand: 'Logitech',
      categoryId: accessoryCategory.id,
      specs: JSON.stringify({
        sensor: 'HERO 25K',
        dpi: '100-25600',
        buttons: '11 programmable',
        weight: '121g',
        cable: '2.1m braided',
      }),
      images: '/images/products/logitech-g502.jpg',
      thumbnail: '/images/products/logitech-g502.jpg',
      stock: 50,
      sku: 'ACC-MOUSE-G502',
      sold: 145,
      rating: 4.8,
      reviews: 67,
      featured: true,
    },
  })

  const accessory2 = await prisma.product.create({
    data: {
      name: 'Bàn phím cơ Keychron K2 V2',
      slug: 'ban-phim-keychron-k2-v2',
      description: 'Bàn phím cơ Keychron K2 V2 với kết nối Bluetooth/USB-C, layout 75%, hot-swap switch, đèn RGB.',
      price: 2190000,
      salePrice: 1990000,
      brand: 'Keychron',
      categoryId: accessoryCategory.id,
      specs: JSON.stringify({
        layout: '75% compact',
        switch: 'Gateron Mechanical',
        connection: 'Bluetooth 5.1 + USB-C',
        battery: '4000mAh',
        backlight: 'RGB',
      }),
      images: '/images/products/keychron-k2.jpg',
      thumbnail: '/images/products/keychron-k2.jpg',
      stock: 35,
      sku: 'ACC-KB-K2V2',
      sold: 98,
      rating: 4.7,
      reviews: 52,
      featured: true,
    },
  })

  const accessory3 = await prisma.product.create({
    data: {
      name: 'Tai nghe Sony WH-1000XM5',
      slug: 'tai-nghe-sony-wh-1000xm5',
      description: 'Tai nghe chống ồn Sony WH-1000XM5 với AI noise cancelling, LDAC, 30 giờ pin, sạc nhanh.',
      price: 8990000,
      salePrice: 7990000,
      brand: 'Sony',
      categoryId: accessoryCategory.id,
      specs: JSON.stringify({
        type: 'Over-ear wireless',
        driver: '30mm',
        battery: '30 hours',
        codec: 'LDAC, AAC, SBC',
        features: 'AI Noise Cancelling, Multipoint',
      }),
      images: '/images/products/sony-wh1000xm5.jpg',
      thumbnail: '/images/products/sony-wh1000xm5.jpg',
      stock: 28,
      sku: 'ACC-HEADPHONE-XM5',
      sold: 76,
      rating: 4.9,
      reviews: 41,
      featured: false,
    },
  })

  console.log(`✅ Created ${laptop1.name}`)
  console.log(`✅ Created ${laptop2.name}`)
  console.log(`✅ Created ${laptop3.name}`)
  console.log(`✅ Created ${phone1.name}`)
  console.log(`✅ Created ${phone2.name}`)
  console.log(`✅ Created ${phone3.name}`)
  console.log(`✅ Created ${tablet1.name}`)
  console.log(`✅ Created ${tablet2.name}`)
  console.log(`✅ Created ${accessory1.name}`)
  console.log(`✅ Created ${accessory2.name}`)
  console.log(`✅ Created ${accessory3.name}`)

  console.log('\n✨ Seed completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Users: 2`)
  console.log(`   - Categories: 4`)
  console.log(`   - Products: 11`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
