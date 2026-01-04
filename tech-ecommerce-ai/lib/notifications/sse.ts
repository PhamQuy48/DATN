// SSE connection management for real-time notifications

// Store active SSE connections
const connections = new Map<string, ReadableStreamDefaultController>()

// Helper function to send notification to specific user
export function notifyUser(userId: string, notification: any) {
  console.log(`[SSE] 📤 Attempting to send notification to user: ${userId}`)
  console.log(`[SSE] 📊 Current connections: ${connections.size} active`)
  console.log(`[SSE] 🔍 Connection exists for user ${userId}:`, connections.has(userId))

  const controller = connections.get(userId)
  if (controller) {
    try {
      const data = JSON.stringify({ type: 'notification', notification })
      controller.enqueue(`data: ${data}\n\n`)
      console.log(`[SSE] ✅ Notification sent successfully to user: ${userId}`)
      console.log(`[SSE] 📦 Notification data:`, notification.title)
    } catch (error) {
      console.error(`[SSE] ❌ Error sending SSE notification to ${userId}:`, error)
      connections.delete(userId)
      console.log(`[SSE] 🗑️ Removed failed connection for user: ${userId}`)
    }
  } else {
    console.log(`[SSE] ⚠️ No active SSE connection found for user: ${userId}`)
    console.log(`[SSE] 📋 Active user IDs:`, Array.from(connections.keys()))
  }
}

// Helper function to update unread count
export function updateUnreadCount(userId: string, count: number) {
  console.log(`[SSE] 📊 Updating unread count for user ${userId}: ${count}`)
  const controller = connections.get(userId)
  if (controller) {
    try {
      const data = JSON.stringify({ type: 'unread_count', count })
      controller.enqueue(`data: ${data}\n\n`)
      console.log(`[SSE] ✅ Unread count updated for user: ${userId}`)
    } catch (error) {
      console.error(`[SSE] ❌ Error sending SSE unread count to ${userId}:`, error)
      connections.delete(userId)
    }
  } else {
    console.log(`[SSE] ⚠️ No connection to send unread count to user: ${userId}`)
  }
}

// Add connection
export function addConnection(userId: string, controller: ReadableStreamDefaultController) {
  connections.set(userId, controller)
  console.log(`[SSE] ➕ Connection added for user: ${userId}`)
  console.log(`[SSE] 📊 Total active connections: ${connections.size}`)
  console.log(`[SSE] 👥 Active users:`, Array.from(connections.keys()))
}

// Remove connection
export function removeConnection(userId: string) {
  const existed = connections.delete(userId)
  console.log(`[SSE] ➖ Connection removed for user: ${userId} (existed: ${existed})`)
  console.log(`[SSE] 📊 Remaining connections: ${connections.size}`)
}

// Get connection
export function getConnection(userId: string) {
  return connections.get(userId)
}

// Get all active connections (for debugging)
export function getActiveConnections() {
  return {
    count: connections.size,
    userIds: Array.from(connections.keys())
  }
}
