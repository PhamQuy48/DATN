/**
 * File cấu hình API LOCAL - Dành cho development
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Copy file này thành `config.local.ts`
 * 2. Thay đổi IP và PORT theo backend server của bạn
 * 3. File config.local.ts sẽ không bị commit lên git (đã có trong .gitignore)
 *
 * LẤY IP VÀ PORT:
 * - Sau khi chạy backend với `npm run dev`, terminal sẽ hiển thị IP và port
 * - Hoặc chạy `ipconfig` (Windows) / `ifconfig` (Mac/Linux) để xem IP
 */

export const LOCAL_CONFIG = {
  // Thay đổi IP này theo máy của bạn
  API_HOST: '192.168.1.2',

  // Thay đổi PORT này nếu backend chạy port khác
  API_PORT: '3004',
}

// Tự động tạo URL
export const API_BASE_URL = `http://${LOCAL_CONFIG.API_HOST}:${LOCAL_CONFIG.API_PORT}`
