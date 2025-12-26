// SSE connection management for real-time notifications

// Store active SSE connections
const connections = new Map<string, ReadableStreamDefaultController>()

// Helper function to send notification to specific user
export function notifyUser(userId: string, notification: any) {
  const controller = connections.get(userId)
  if (controller) {
    try {
      const data = JSON.stringify({ type: 'notification', notification })
      controller.enqueue(`data: ${data}\n\n`)
    } catch (error) {
      console.error('Error sending SSE notification:', error)
      connections.delete(userId)
    }
  }
}

// Helper function to update unread count
export function updateUnreadCount(userId: string, count: number) {
  const controller = connections.get(userId)
  if (controller) {
    try {
      const data = JSON.stringify({ type: 'unread_count', count })
      controller.enqueue(`data: ${data}\n\n`)
    } catch (error) {
      console.error('Error sending SSE unread count:', error)
      connections.delete(userId)
    }
  }
}

// Add connection
export function addConnection(userId: string, controller: ReadableStreamDefaultController) {
  connections.set(userId, controller)
}

// Remove connection
export function removeConnection(userId: string) {
  connections.delete(userId)
}

// Get connection
export function getConnection(userId: string) {
  return connections.get(userId)
}
