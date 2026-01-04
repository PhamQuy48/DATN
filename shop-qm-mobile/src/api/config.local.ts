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
  // IP hiện tại của máy: 172.16.0.93
  API_HOST: '172.16.0.93',

  // Backend đang chạy trên port 3004
  API_PORT: '3004',
}

// Tự động tạo URL
export const API_BASE_URL = `http://${LOCAL_CONFIG.API_HOST}:${LOCAL_CONFIG.API_PORT}`
