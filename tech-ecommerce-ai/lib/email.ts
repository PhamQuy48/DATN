import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail(email: string, resetCode: string) {
  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Đặt lại mật khẩu - SHOP QM',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .code-box {
              background: white;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 5px;
              font-family: 'Courier New', monospace;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
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
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Đặt lại mật khẩu</h1>
              <p>SHOP QM</p>
            </div>
            <div class="content">
              <h2>Xin chào!</h2>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>

              <div class="code-box">
                <p style="margin: 0 0 10px 0; color: #666;">Mã xác nhận của bạn là:</p>
                <div class="code">${resetCode}</div>
              </div>

              <p>Vui lòng nhập mã này vào trang đặt lại mật khẩu. Mã có hiệu lực trong <strong>15 phút</strong>.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetCode}" class="button">
                  Đặt lại mật khẩu
                </a>
              </div>

              <div class="warning">
                <strong>⚠️ Lưu ý:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                  <li>Không chia sẻ mã này với bất kỳ ai</li>
                  <li>Mã này chỉ sử dụng được 1 lần</li>
                </ul>
              </div>

              <p>Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.</p>

              <p>Trân trọng,<br><strong>Đội ngũ SHOP QM</strong></p>
            </div>

            <div class="footer">
              <p>© 2025 SHOP QM. All rights reserved.</p>
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Generate random 6-digit code
export function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
