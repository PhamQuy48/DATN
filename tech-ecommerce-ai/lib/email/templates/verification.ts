export function generateVerificationEmail(data: {
  name: string
  verificationUrl: string
  verificationCode: string
}): string {
  const { name, verificationUrl, verificationCode } = data

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác Thực Email</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: white;
      padding: 40px 30px;
      border-radius: 0 0 10px 10px;
    }
    .code-box {
      background: white;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info {
      background: #d1ecf1;
      border-left: 4px solid #0c5460;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      color: #0c5460;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">✉️ Xác Thực Email</h1>
      <p style="margin: 10px 0 0; opacity: 0.95;">Thế Giới Công Nghệ - ShopQM</p>
    </div>

    <div class="content">
      <h2 style="color: #2d3748; margin-top: 0;">Xin chào ${name}!</h2>

      <p style="color: #4a5568; line-height: 1.6;">
        Cảm ơn bạn đã đăng ký tài khoản tại <strong>ShopQM</strong>.
        Để hoàn tất quá trình đăng ký và đảm bảo an toàn cho tài khoản của bạn,
        vui lòng xác thực địa chỉ email này.
      </p>

      <div class="info">
        <strong>📌 Tại sao cần xác thực email?</strong>
        <ul style="margin: 10px 0 0 20px; padding: 0;">
          <li>Đảm bảo bạn có thể nhận thông tin đơn hàng</li>
          <li>Nhận voucher và khuyến mãi độc quyền</li>
          <li>Khôi phục mật khẩu khi cần thiết</li>
          <li>Bảo vệ tài khoản khỏi truy cập trái phép</li>
        </ul>
      </div>

      <div class="code-box">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Mã xác thực của bạn:</p>
        <div class="code">${verificationCode}</div>
        <p style="margin: 15px 0 0; color: #718096; font-size: 13px;">
          Mã có hiệu lực trong <strong>24 giờ</strong>
        </p>
      </div>

      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">
          ✓ Xác Thực Email Ngay
        </a>
      </div>

      <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 20px;">
        Hoặc copy link sau vào trình duyệt:<br>
        <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
      </p>

      <div class="warning">
        <strong>⚠️ Lưu ý bảo mật:</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>Không chia sẻ mã này với bất kỳ ai</li>
          <li>ShopQM không bao giờ yêu cầu mã xác thực qua điện thoại</li>
          <li>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này</li>
        </ul>
      </div>

      <p style="color: #4a5568; line-height: 1.6; margin-top: 30px;">
        Nếu bạn gặp vấn đề trong quá trình xác thực, vui lòng liên hệ với chúng tôi
        qua email <a href="mailto:support@shopqm.com" style="color: #667eea;">support@shopqm.com</a>
      </p>

      <p style="color: #2d3748; margin-top: 30px;">
        Trân trọng,<br>
        <strong>Đội ngũ ShopQM</strong>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0;">© ${new Date().getFullYear()} ShopQM - Thế Giới Công Nghệ. All rights reserved.</p>
      <p style="margin: 5px 0;">Email này được gửi tự động, vui lòng không trả lời.</p>
      <div style="margin-top: 15px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #667eea; text-decoration: none; margin: 0 10px;">Trang chủ</a>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #667eea; text-decoration: none; margin: 0 10px;">Liên hệ</a>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/faq" style="color: #667eea; text-decoration: none; margin: 0 10px;">FAQ</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
