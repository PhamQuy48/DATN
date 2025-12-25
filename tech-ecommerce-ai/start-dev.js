const { exec } = require('child_process');
const os = require('os');
const net = require('net');

// Lấy IP local của máy
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Bỏ qua internal và IPv6
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Kiểm tra port có available không
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
}

// Tìm port available
async function findAvailablePort(startPort = 3004) {
  let port = startPort;
  while (port < startPort + 10) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error('Không tìm thấy port available trong khoảng 3004-3014');
}

// Main function
async function startDev() {
  console.log('🚀 Đang khởi động server...\n');

  try {
    const port = await findAvailablePort(3004);
    const localIP = getLocalIP();

    console.log('✅ Tìm thấy port available:', port);
    console.log('📱 Địa chỉ IP local:', localIP);
    console.log('\n📋 Cấu hình cho Mobile App:');
    console.log('   API_BASE_URL =', `http://${localIP}:${port}`);
    console.log('\n🌐 Web App sẽ chạy tại:');
    console.log('   Local:  ', `http://localhost:${port}`);
    console.log('   Network:', `http://${localIP}:${port}`);
    console.log('\n' + '='.repeat(60) + '\n');

    // Khởi động Next.js với port đã tìm được
    const devProcess = exec(`next dev -p ${port}`, {
      cwd: __dirname,
      env: { ...process.env, PORT: port }
    });

    devProcess.stdout.pipe(process.stdout);
    devProcess.stderr.pipe(process.stderr);

    devProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Server stopped với code ${code}`);
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi khởi động:', error.message);
    process.exit(1);
  }
}

// Bắt đầu
startDev();
