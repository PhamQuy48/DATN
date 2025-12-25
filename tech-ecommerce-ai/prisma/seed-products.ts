import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Categories data
const categories = [
  {
    name: 'Điện thoại',
    slug: 'dien-thoai',
    description: 'Điện thoại thông minh cao cấp từ Apple, Samsung, Xiaomi...',
    image: '/images/categories/phone.jpg',
  },
  {
    name: 'Laptop',
    slug: 'laptop',
    description: 'Laptop cho học tập, văn phòng, gaming, đồ họa',
    image: '/images/categories/laptop.jpg',
  },
  {
    name: 'Tablet',
    slug: 'tablet',
    description: 'Máy tính bảng iPad, Samsung Galaxy Tab...',
    image: '/images/categories/tablet.jpg',
  },
  {
    name: 'Smartwatch',
    slug: 'smartwatch',
    description: 'Đồng hồ thông minh Apple Watch, Samsung Galaxy Watch...',
    image: '/images/categories/watch.jpg',
  },
  {
    name: 'Tai nghe',
    slug: 'tai-nghe',
    description: 'Tai nghe Bluetooth, tai nghe gaming, tai nghe studio',
    image: '/images/categories/headphone.jpg',
  },
  {
    name: 'TV',
    slug: 'tivi',
    description: 'Smart TV 4K, QLED, OLED từ Samsung, LG, Sony...',
    image: '/images/categories/tv.jpg',
  },
  {
    name: 'Phụ kiện',
    slug: 'phu-kien',
    description: 'Sạc, cáp, ốp lưng, bàn phím, chuột...',
    image: '/images/categories/accessory.jpg',
  },
]

// Products data - Giống Thế Giới Di Động
const products = [
  // ========== ĐIỆN THOẠI ==========
  // iPhone
  {
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    brand: 'Apple',
    price: 34990000,
    salePrice: 32990000,
    description: 'iPhone 15 Pro Max - Titan mới, Camera 48MP, chip A17 Pro',
    categorySlug: 'dien-thoai',
    stock: 50,
    rating: 4.9,
    sold: 1250,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-2.jpg',
    ],
    specs: {
      screen: '6.7" Super Retina XDR',
      os: 'iOS 17',
      camera: '48MP + 12MP + 12MP',
      cameraFront: '12MP',
      cpu: 'Apple A17 Pro',
      ram: '8GB',
      storage: '256GB',
      battery: '4422mAh',
    },
  },
  {
    name: 'iPhone 14 Pro Max 128GB',
    slug: 'iphone-14-pro-max-128gb',
    brand: 'Apple',
    price: 29990000,
    salePrice: 26990000,
    description: 'iPhone 14 Pro Max - Dynamic Island, chip A16 Bionic',
    categorySlug: 'dien-thoai',
    stock: 35,
    rating: 4.8,
    sold: 2100,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/289700/iphone-14-pro-max-purple-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/289700/iphone-14-pro-max-purple-2.jpg',
    ],
    specs: {
      screen: '6.7" Super Retina XDR',
      os: 'iOS 16',
      camera: '48MP + 12MP + 12MP',
      cameraFront: '12MP',
      cpu: 'Apple A16 Bionic',
      ram: '6GB',
      storage: '128GB',
      battery: '4323mAh',
    },
  },
  {
    name: 'iPhone 13 128GB',
    slug: 'iphone-13-128gb',
    brand: 'Apple',
    price: 18990000,
    salePrice: 16490000,
    description: 'iPhone 13 - Màn hình 6.1", chip A15 Bionic mạnh mẽ',
    categorySlug: 'dien-thoai',
    stock: 80,
    rating: 4.7,
    sold: 3500,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-blue-1-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-2.jpg',
    ],
    specs: {
      screen: '6.1" Super Retina XDR',
      os: 'iOS 15',
      camera: '12MP + 12MP',
      cameraFront: '12MP',
      cpu: 'Apple A15 Bionic',
      ram: '4GB',
      storage: '128GB',
      battery: '3240mAh',
    },
  },

  // Samsung
  {
    name: 'Samsung Galaxy S24 Ultra 12GB 256GB',
    slug: 'samsung-galaxy-s24-ultra-12gb-256gb',
    brand: 'Samsung',
    price: 33990000,
    salePrice: 29990000,
    description: 'Galaxy S24 Ultra - AI phone, S Pen tích hợp, camera 200MP',
    categorySlug: 'dien-thoai',
    stock: 45,
    rating: 4.9,
    sold: 850,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-1.jpg',
    ],
    specs: {
      screen: '6.8" Dynamic AMOLED 2X',
      os: 'Android 14',
      camera: '200MP + 50MP + 12MP + 10MP',
      cameraFront: '12MP',
      cpu: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      battery: '5000mAh',
    },
  },
  {
    name: 'Samsung Galaxy Z Fold5 12GB 256GB',
    slug: 'samsung-galaxy-z-fold5-12gb-256gb',
    brand: 'Samsung',
    price: 44990000,
    salePrice: 37990000,
    description: 'Galaxy Z Fold5 - Điện thoại gập cao cấp, màn hình 7.6"',
    categorySlug: 'dien-thoai',
    stock: 20,
    rating: 4.8,
    sold: 320,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/309761/samsung-galaxy-z-fold5-kem-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/309761/samsung-galaxy-z-fold5-kem-2.jpg',
    ],
    specs: {
      screen: '7.6" Dynamic AMOLED 2X',
      os: 'Android 13',
      camera: '50MP + 12MP + 10MP',
      cameraFront: '10MP + 4MP',
      cpu: 'Snapdragon 8 Gen 2',
      ram: '12GB',
      storage: '256GB',
      battery: '4400mAh',
    },
  },
  {
    name: 'Samsung Galaxy A54 5G 8GB 128GB',
    slug: 'samsung-galaxy-a54-5g-8gb-128gb',
    brand: 'Samsung',
    price: 10990000,
    salePrice: 8990000,
    description: 'Galaxy A54 5G - Màn hình 120Hz, camera 50MP, pin 5000mAh',
    categorySlug: 'dien-thoai',
    stock: 100,
    rating: 4.5,
    sold: 2800,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/301607/samsung-galaxy-a54-5g-den-thumb-1-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/301607/samsung-galaxy-a54-5g-1.jpg',
    ],
    specs: {
      screen: '6.4" Super AMOLED',
      os: 'Android 13',
      camera: '50MP + 12MP + 5MP',
      cameraFront: '32MP',
      cpu: 'Exynos 1380',
      ram: '8GB',
      storage: '128GB',
      battery: '5000mAh',
    },
  },

  // Xiaomi
  {
    name: 'Xiaomi 14 Ultra 16GB 512GB',
    slug: 'xiaomi-14-ultra-16gb-512gb',
    brand: 'Xiaomi',
    price: 29990000,
    salePrice: 26990000,
    description: 'Xiaomi 14 Ultra - Camera Leica, Snapdragon 8 Gen 3',
    categorySlug: 'dien-thoai',
    stock: 30,
    rating: 4.7,
    sold: 580,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/321925/xiaomi-14-ultra-den-1-750x500.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/321925/xiaomi-14-ultra-den-2.jpg',
    ],
    specs: {
      screen: '6.73" AMOLED',
      os: 'Android 14',
      camera: '50MP + 50MP + 50MP + 50MP',
      cameraFront: '32MP',
      cpu: 'Snapdragon 8 Gen 3',
      ram: '16GB',
      storage: '512GB',
      battery: '5000mAh',
    },
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro 8GB 128GB',
    slug: 'xiaomi-redmi-note-13-pro-8gb-128gb',
    brand: 'Xiaomi',
    price: 7490000,
    salePrice: 6490000,
    description: 'Redmi Note 13 Pro - Camera 200MP, sạc nhanh 67W',
    categorySlug: 'dien-thoai',
    stock: 150,
    rating: 4.4,
    sold: 4200,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/317622/xiaomi-redmi-note-13-pro-tim-1-750x500.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/317622/xiaomi-redmi-note-13-pro-tim-2.jpg',
    ],
    specs: {
      screen: '6.67" AMOLED',
      os: 'Android 13',
      camera: '200MP + 8MP + 2MP',
      cameraFront: '16MP',
      cpu: 'Snapdragon 7s Gen 2',
      ram: '8GB',
      storage: '128GB',
      battery: '5100mAh',
    },
  },

  // OPPO
  {
    name: 'OPPO Find N3 Flip 12GB 256GB',
    slug: 'oppo-find-n3-flip-12gb-256gb',
    brand: 'OPPO',
    price: 22990000,
    salePrice: 19990000,
    description: 'Find N3 Flip - Điện thoại gập vỏ sò, camera 50MP',
    categorySlug: 'dien-thoai',
    stock: 25,
    rating: 4.6,
    sold: 420,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/313206/oppo-find-n3-flip-hong-1-750x500.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/313206/oppo-find-n3-flip-hong-2.jpg',
    ],
    specs: {
      screen: '6.8" AMOLED',
      os: 'Android 13',
      camera: '50MP + 48MP + 32MP',
      cameraFront: '32MP',
      cpu: 'MediaTek Dimensity 9200',
      ram: '12GB',
      storage: '256GB',
      battery: '4300mAh',
    },
  },
  {
    name: 'OPPO Reno11 5G 8GB 256GB',
    slug: 'oppo-reno11-5g-8gb-256gb',
    brand: 'OPPO',
    price: 9990000,
    salePrice: 8490000,
    description: 'OPPO Reno11 5G - Thiết kế mỏng nhẹ, camera chân dung đỉnh cao',
    categorySlug: 'dien-thoai',
    stock: 80,
    rating: 4.3,
    sold: 1850,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/42/316771/oppo-reno11-5g-xanh-1-750x500.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/316771/oppo-reno11-5g-xanh-2.jpg',
    ],
    specs: {
      screen: '6.7" AMOLED',
      os: 'Android 14',
      camera: '50MP + 32MP + 8MP',
      cameraFront: '32MP',
      cpu: 'MediaTek Dimensity 7050',
      ram: '8GB',
      storage: '256GB',
      battery: '5000mAh',
    },
  },

  // ========== LAPTOP ==========
  // MacBook
  {
    name: 'MacBook Air M2 13 inch 2022 8GB 256GB',
    slug: 'macbook-air-m2-13-2022-8gb-256gb',
    brand: 'Apple',
    price: 28990000,
    salePrice: 24990000,
    description: 'MacBook Air M2 - Mỏng nhẹ, hiệu năng vượt trội với chip M2',
    categorySlug: 'laptop',
    stock: 40,
    rating: 4.9,
    sold: 980,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-xam-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-xam-2.jpg',
    ],
    specs: {
      cpu: 'Apple M2 8-core',
      ram: '8GB',
      storage: '256GB SSD',
      screen: '13.6" Liquid Retina',
      vga: 'Apple M2 GPU 8-core',
      weight: '1.24kg',
      os: 'macOS',
    },
  },
  {
    name: 'MacBook Pro 14 M3 Pro 11-core 18GB 512GB',
    slug: 'macbook-pro-14-m3-pro-11core-18gb-512gb',
    brand: 'Apple',
    price: 54990000,
    salePrice: 52990000,
    description: 'MacBook Pro 14" M3 Pro - Hiệu năng chuyên nghiệp, màn hình ProMotion',
    categorySlug: 'laptop',
    stock: 25,
    rating: 5.0,
    sold: 420,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-pro-14-m3-pro-2023-den-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-pro-14-m3-pro-2023-den-2.jpg',
    ],
    specs: {
      cpu: 'Apple M3 Pro 11-core',
      ram: '18GB',
      storage: '512GB SSD',
      screen: '14.2" Liquid Retina XDR',
      vga: 'Apple M3 Pro GPU 14-core',
      weight: '1.55kg',
      os: 'macOS',
    },
  },

  // Dell
  {
    name: 'Dell XPS 13 Plus 9320 i7 1260P 16GB 512GB',
    slug: 'dell-xps-13-plus-9320-i7-1260p-16gb-512gb',
    brand: 'Dell',
    price: 42990000,
    salePrice: 38990000,
    description: 'Dell XPS 13 Plus - Thiết kế siêu mỏng, hiệu năng Intel thế hệ 12',
    categorySlug: 'laptop',
    stock: 30,
    rating: 4.7,
    sold: 580,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/288880/dell-xps-13-plus-9320-i7-u684512w11-thumb-1-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/288880/dell-xps-13-plus-9320-i7-2.jpg',
    ],
    specs: {
      cpu: 'Intel Core i7-1260P',
      ram: '16GB',
      storage: '512GB SSD',
      screen: '13.4" FHD+',
      vga: 'Intel Iris Xe',
      weight: '1.24kg',
      os: 'Windows 11',
    },
  },
  {
    name: 'Dell Gaming G15 5530 i7 13650HX 16GB 512GB RTX 4060',
    slug: 'dell-gaming-g15-5530-i7-13650hx-16gb-512gb-rtx4060',
    brand: 'Dell',
    price: 32990000,
    salePrice: 28990000,
    description: 'Dell G15 - Laptop gaming giá tốt, RTX 4060 chiến game mượt',
    categorySlug: 'laptop',
    stock: 45,
    rating: 4.6,
    sold: 1250,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/313845/dell-gaming-g15-5530-i7-70266670-xam-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/313845/dell-gaming-g15-5530-i7-70266670-xam-2.jpg',
    ],
    specs: {
      cpu: 'Intel Core i7-13650HX',
      ram: '16GB',
      storage: '512GB SSD',
      screen: '15.6" FHD 165Hz',
      vga: 'NVIDIA RTX 4060 8GB',
      weight: '2.65kg',
      os: 'Windows 11',
    },
  },

  // ASUS
  {
    name: 'ASUS ROG Zephyrus G14 GA402XV R9 7940HS 16GB 1TB RTX 4060',
    slug: 'asus-rog-zephyrus-g14-ga402xv-r9-7940hs-16gb-1tb-rtx4060',
    brand: 'ASUS',
    price: 45990000,
    salePrice: 41990000,
    description: 'ROG Zephyrus G14 - Gaming mỏng nhẹ, AMD Ryzen 9 mạnh mẽ',
    categorySlug: 'laptop',
    stock: 20,
    rating: 4.8,
    sold: 680,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/313283/asus-rog-zephyrus-g14-ga402xv-r9-n4058w-thumb-1-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/313283/asus-rog-zephyrus-g14-ga402xv-r9-2.jpg',
    ],
    specs: {
      cpu: 'AMD Ryzen 9 7940HS',
      ram: '16GB',
      storage: '1TB SSD',
      screen: '14" 2.5K 165Hz',
      vga: 'NVIDIA RTX 4060 8GB',
      weight: '1.65kg',
      os: 'Windows 11',
    },
  },
  {
    name: 'ASUS Vivobook 15 OLED A1505VA i5 13500H 16GB 512GB',
    slug: 'asus-vivobook-15-oled-a1505va-i5-13500h-16gb-512gb',
    brand: 'ASUS',
    price: 16990000,
    salePrice: 14490000,
    description: 'Vivobook 15 OLED - Màn hình OLED sống động, phù hợp văn phòng',
    categorySlug: 'laptop',
    stock: 60,
    rating: 4.4,
    sold: 1850,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/309016/asus-vivobook-15-oled-a1505va-i5-ma415w-thumb-1-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/309016/asus-vivobook-15-oled-a1505va-i5-2.jpg',
    ],
    specs: {
      cpu: 'Intel Core i5-13500H',
      ram: '16GB',
      storage: '512GB SSD',
      screen: '15.6" OLED 2.8K',
      vga: 'Intel Iris Xe',
      weight: '1.7kg',
      os: 'Windows 11',
    },
  },

  // HP
  {
    name: 'HP Envy x360 14 bf0127TU i7 1255U 16GB 512GB',
    slug: 'hp-envy-x360-14-bf0127tu-i7-1255u-16gb-512gb',
    brand: 'HP',
    price: 24990000,
    salePrice: 21990000,
    description: 'HP Envy x360 - Laptop xoay gập 360°, phù hợp sáng tạo nội dung',
    categorySlug: 'laptop',
    stock: 35,
    rating: 4.5,
    sold: 720,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/44/289943/hp-envy-x360-14-bf0127tu-i7-6k7f5pa-thumb-1-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/44/289943/hp-envy-x360-14-bf0127tu-i7-2.jpg',
    ],
    specs: {
      cpu: 'Intel Core i7-1255U',
      ram: '16GB',
      storage: '512GB SSD',
      screen: '14" FHD Touch',
      vga: 'Intel Iris Xe',
      weight: '1.39kg',
      os: 'Windows 11',
    },
  },

  // ========== TABLET ==========
  {
    name: 'iPad Pro M2 11 inch WiFi 128GB',
    slug: 'ipad-pro-m2-11-wifi-128gb',
    brand: 'Apple',
    price: 21990000,
    salePrice: 19990000,
    description: 'iPad Pro M2 11" - Hiệu năng đỉnh cao, hỗ trợ Apple Pencil 2',
    categorySlug: 'tablet',
    stock: 50,
    rating: 4.9,
    sold: 850,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/522/289787/ipad-pro-m2-11-inch-wifi-2022-xam-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/522/289787/ipad-pro-m2-11-inch-wifi-2022-xam-2.jpg',
    ],
    specs: {
      screen: '11" Liquid Retina',
      os: 'iPadOS 16',
      cpu: 'Apple M2',
      ram: '8GB',
      storage: '128GB',
      camera: '12MP + 10MP',
      battery: '7538mAh',
    },
  },
  {
    name: 'iPad Air 5 M1 10.9 inch WiFi 64GB',
    slug: 'ipad-air-5-m1-10-9-wifi-64gb',
    brand: 'Apple',
    price: 16990000,
    salePrice: 14490000,
    description: 'iPad Air 5 - Chip M1 mạnh mẽ, thiết kế viền mỏng',
    categorySlug: 'tablet',
    stock: 70,
    rating: 4.8,
    sold: 1520,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/522/247517/ipad-air-5-xanh-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/522/247517/ipad-air-5-xanh-2.jpg',
    ],
    specs: {
      screen: '10.9" Liquid Retina',
      os: 'iPadOS 15',
      cpu: 'Apple M1',
      ram: '8GB',
      storage: '64GB',
      camera: '12MP',
      battery: '7606mAh',
    },
  },
  {
    name: 'Samsung Galaxy Tab S9 11 inch 8GB 128GB',
    slug: 'samsung-galaxy-tab-s9-11-8gb-128gb',
    brand: 'Samsung',
    price: 19990000,
    salePrice: 16990000,
    description: 'Galaxy Tab S9 - Màn hình Dynamic AMOLED 2X, S Pen tích hợp',
    categorySlug: 'tablet',
    stock: 40,
    rating: 4.7,
    sold: 680,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/522/306214/samsung-galaxy-tab-s9-xam-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/522/306214/samsung-galaxy-tab-s9-xam-2.jpg',
    ],
    specs: {
      screen: '11" Dynamic AMOLED 2X',
      os: 'Android 13',
      cpu: 'Snapdragon 8 Gen 2',
      ram: '8GB',
      storage: '128GB',
      camera: '13MP + 8MP',
      battery: '8400mAh',
    },
  },

  // ========== SMARTWATCH ==========
  {
    name: 'Apple Watch Series 9 GPS 41mm',
    slug: 'apple-watch-series-9-gps-41mm',
    brand: 'Apple',
    price: 10990000,
    salePrice: 9490000,
    description: 'Apple Watch S9 - Chip S9 mới, màn hình sáng hơn, tính năng sức khỏe',
    categorySlug: 'smartwatch',
    stock: 100,
    rating: 4.8,
    sold: 2100,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/7077/309732/apple-watch-s9-gps-41mm-vien-nhom-day-cao-su-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/7077/309732/apple-watch-s9-gps-41mm-vien-nhom-day-cao-su-2.jpg',
    ],
    specs: {
      screen: '1.69" OLED',
      chip: 'Apple S9',
      memory: '64GB',
      battery: 'Đến 18 giờ',
      waterproof: 'Chống nước 50m',
      connectivity: 'Bluetooth 5.3',
    },
  },
  {
    name: 'Samsung Galaxy Watch 6 LTE 40mm',
    slug: 'samsung-galaxy-watch-6-lte-40mm',
    brand: 'Samsung',
    price: 8990000,
    salePrice: 7490000,
    description: 'Galaxy Watch 6 - Theo dõi sức khỏe toàn diện, kết nối LTE',
    categorySlug: 'smartwatch',
    stock: 80,
    rating: 4.6,
    sold: 1580,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/7077/309028/samsung-galaxy-watch-6-lte-40mm-vang-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/7077/309028/samsung-galaxy-watch-6-lte-40mm-vang-2.jpg',
    ],
    specs: {
      screen: '1.31" AMOLED',
      chip: 'Exynos W930',
      memory: '16GB',
      battery: '300mAh - 30 giờ',
      waterproof: 'Chống nước IP68',
      connectivity: 'LTE, Bluetooth 5.3',
    },
  },

  // ========== TAI NGHE ==========
  {
    name: 'AirPods Pro 2 USB-C',
    slug: 'airpods-pro-2-usb-c',
    brand: 'Apple',
    price: 6490000,
    salePrice: 5990000,
    description: 'AirPods Pro 2 - Chống ồn chủ động, chip H2, sạc USB-C',
    categorySlug: 'tai-nghe',
    stock: 150,
    rating: 4.9,
    sold: 3500,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/54/313572/airpods-pro-2-usb-c-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/54/313572/airpods-pro-2-usb-c-2.jpg',
    ],
    specs: {
      type: 'Nhét tai True Wireless',
      bluetooth: 'v5.3',
      batteryLife: '6 giờ - hộp sạc 30 giờ',
      features: 'Chống ồn ANC, Âm thanh không gian',
      waterproof: 'IPX4',
    },
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    brand: 'Sony',
    price: 8990000,
    salePrice: 7490000,
    description: 'Sony WH-1000XM5 - Tai nghe chống ồn tốt nhất, âm thanh Hi-Res',
    categorySlug: 'tai-nghe',
    stock: 80,
    rating: 4.8,
    sold: 1250,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/54/289939/tai-nghe-bluetooth-sony-wh-1000xm5-den-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/54/289939/tai-nghe-bluetooth-sony-wh-1000xm5-den-2.jpg',
    ],
    specs: {
      type: 'Chụp tai Over-ear',
      bluetooth: 'v5.2',
      batteryLife: '30 giờ',
      features: 'Chống ồn ANC cực tốt, LDAC, Hi-Res',
      weight: '250g',
    },
  },
  {
    name: 'Samsung Galaxy Buds2 Pro',
    slug: 'samsung-galaxy-buds2-pro',
    brand: 'Samsung',
    price: 4490000,
    salePrice: 3490000,
    description: 'Galaxy Buds2 Pro - Chống ồn chủ động, âm thanh 360°',
    categorySlug: 'tai-nghe',
    stock: 120,
    rating: 4.5,
    sold: 2800,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/54/289036/samsung-galaxy-buds2-pro-tim-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/54/289036/samsung-galaxy-buds2-pro-tim-2.jpg',
    ],
    specs: {
      type: 'Nhét tai True Wireless',
      bluetooth: 'v5.3',
      batteryLife: '5 giờ - hộp sạc 18 giờ',
      features: 'Chống ồn ANC, Âm thanh 360',
      waterproof: 'IPX7',
    },
  },

  // ========== TV ==========
  {
    name: 'Smart Tivi Samsung QLED 4K 55 inch QA55Q80C',
    slug: 'samsung-qled-4k-55-qa55q80c',
    brand: 'Samsung',
    price: 19990000,
    salePrice: 16990000,
    description: 'Samsung QLED Q80C - Quantum Dot, 120Hz, Gaming Hub',
    categorySlug: 'tivi',
    stock: 30,
    rating: 4.7,
    sold: 580,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/1942/309508/samsung-qled-4k-55-inch-qa55q80c-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/1942/309508/samsung-qled-4k-55-inch-qa55q80c-2.jpg',
    ],
    specs: {
      screen: '55 inch 4K (3840 x 2160)',
      technology: 'QLED, Quantum Dot',
      os: 'Tizen OS',
      refresh: '120Hz',
      features: 'Gaming Hub, Q-Symphony, Object Tracking Sound',
    },
  },
  {
    name: 'Smart Tivi LG OLED 4K 55 inch OLED55C3PSA',
    slug: 'lg-oled-4k-55-oled55c3psa',
    brand: 'LG',
    price: 29990000,
    salePrice: 26990000,
    description: 'LG OLED C3 - Màn hình OLED evo, α9 Gen6, Dolby Vision',
    categorySlug: 'tivi',
    stock: 20,
    rating: 4.9,
    sold: 320,
    featured: true,
    images: [
      'https://cdn.tgdd.vn/Products/Images/1942/306204/lg-oled-4k-55-inch-oled55c3psa-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/1942/306204/lg-oled-4k-55-inch-oled55c3psa-2.jpg',
    ],
    specs: {
      screen: '55 inch 4K (3840 x 2160)',
      technology: 'OLED evo',
      os: 'webOS 23',
      refresh: '120Hz',
      features: 'α9 Gen6 AI, Dolby Vision IQ, Game Optimizer',
    },
  },

  // ========== PHỤ KIỆN ==========
  {
    name: 'Chuột Logitech MX Master 3S',
    slug: 'chuot-logitech-mx-master-3s',
    brand: 'Logitech',
    price: 2490000,
    salePrice: 2190000,
    description: 'Logitech MX Master 3S - Chuột không dây cao cấp cho năng suất',
    categorySlug: 'phu-kien',
    stock: 100,
    rating: 4.8,
    sold: 1850,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/86/289052/chuot-khong-day-logitech-mx-master-3s-den-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/86/289052/chuot-khong-day-logitech-mx-master-3s-den-2.jpg',
    ],
    specs: {
      type: 'Chuột không dây',
      dpi: '8000 DPI',
      battery: 'Pin sạc 70 ngày',
      connectivity: 'Bluetooth, USB-C',
    },
  },
  {
    name: 'Bàn phím cơ Logitech MX Mechanical',
    slug: 'ban-phim-co-logitech-mx-mechanical',
    brand: 'Logitech',
    price: 3490000,
    salePrice: 2990000,
    description: 'MX Mechanical - Bàn phím cơ cao cấp, switch Linear, đèn nền',
    categorySlug: 'phu-kien',
    stock: 60,
    rating: 4.7,
    sold: 680,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/4547/289053/ban-phim-khong-day-logitech-mx-mechanical-xam-1-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/4547/289053/ban-phim-khong-day-logitech-mx-mechanical-xam-2.jpg',
    ],
    specs: {
      type: 'Bàn phím cơ không dây',
      switch: 'Linear (Tactile)',
      battery: 'Pin sạc 15 ngày',
      connectivity: 'Bluetooth, USB-C',
    },
  },
  {
    name: 'Sạc nhanh Apple 20W USB-C Power Adapter',
    slug: 'sac-apple-20w-usb-c',
    brand: 'Apple',
    price: 490000,
    salePrice: 390000,
    description: 'Sạc nhanh 20W chính hãng Apple, sạc nhanh iPhone, iPad',
    categorySlug: 'phu-kien',
    stock: 300,
    rating: 4.6,
    sold: 5200,
    featured: false,
    images: [
      'https://cdn.tgdd.vn/Products/Images/58/228728/sac-20w-type-c-apple-mhje3-ava-600x600.jpg',
    ],
    specs: {
      power: '20W',
      port: 'USB-C',
      compatible: 'iPhone, iPad, AirPods',
    },
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Cleaning database...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Seed categories
  console.log('📦 Seeding categories...')
  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  )
  console.log(`✅ Created ${createdCategories.length} categories`)

  // Seed products
  console.log('🛍️  Seeding products...')
  let productCount = 0

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    })

    if (!category) {
      console.log(`⚠️  Category not found for: ${product.name}`)
      continue
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        price: product.price,
        salePrice: product.salePrice,
        description: product.description,
        categoryId: category.id,
        stock: product.stock,
        rating: product.rating,
        sold: product.sold,
        featured: product.featured,
        images: product.images.join(','),
        thumbnail: product.images[0],
        specs: product.specs,
        sku: `SKU-${Date.now()}-${productCount}`,
        views: Math.floor(Math.random() * 10000),
        reviews: Math.floor(Math.random() * 500),
      },
    })

    productCount++
    console.log(`   ✓ ${product.name}`)
  }

  console.log(`✅ Created ${productCount} products`)
  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
