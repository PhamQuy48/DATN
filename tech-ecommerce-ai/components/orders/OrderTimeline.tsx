import { Check, Clock, Package, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDING'

type TimelineStep = {
  status: OrderStatus
  label: string
  icon: React.ReactNode
  description: string
}

type OrderTimelineProps = {
  currentStatus: OrderStatus
  createdAt?: string
  updatedAt?: string
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: 'PENDING',
    label: 'Chờ xác nhận',
    icon: <Clock className="w-5 h-5" />,
    description: 'Đơn hàng đang chờ xác nhận'
  },
  {
    status: 'PROCESSING',
    label: 'Đang xử lý',
    icon: <Package className="w-5 h-5" />,
    description: 'Đơn hàng đang được chuẩn bị'
  },
  {
    status: 'SHIPPING',
    label: 'Đang giao hàng',
    icon: <Truck className="w-5 h-5" />,
    description: 'Đơn hàng đang trên đường giao'
  },
  {
    status: 'COMPLETED',
    label: 'Hoàn thành',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Đơn hàng đã giao thành công'
  }
]

const SPECIAL_STATUSES: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  CANCELLED: {
    label: 'Đã hủy',
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  REFUNDING: {
    label: 'Đang hoàn tiền',
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
}

export default function OrderTimeline({ currentStatus, createdAt, updatedAt }: OrderTimelineProps) {
  // Check if order is in a special status (cancelled or refunding)
  const specialStatus = SPECIAL_STATUSES[currentStatus]

  if (specialStatus) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h3>

        <div className={`flex items-center gap-4 p-6 rounded-lg ${specialStatus.bgColor}`}>
          <div className={`flex-shrink-0 w-16 h-16 ${specialStatus.bgColor} rounded-full flex items-center justify-center ${specialStatus.color}`}>
            {specialStatus.icon}
          </div>
          <div>
            <h4 className={`text-xl font-bold ${specialStatus.color}`}>{specialStatus.label}</h4>
            <p className="text-gray-600 mt-1">
              {currentStatus === 'CANCELLED'
                ? 'Đơn hàng đã được hủy'
                : 'Đơn hàng đang được hoàn tiền'}
            </p>
            {updatedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Cập nhật: {new Date(updatedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Normal timeline for active orders
  const currentStepIndex = TIMELINE_STEPS.findIndex(step => step.status === currentStatus)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h3>

      <div className="relative">
        {/* Timeline Steps */}
        <div className="space-y-6">
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Vertical Line */}
                {index < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-12 ${
                      isCompleted || isCurrent ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}

                {/* Icon Circle */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-600 text-blue-600'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <div className={`font-semibold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
                  <div className={`text-sm mt-1 ${isCurrent ? 'text-gray-700' : 'text-gray-500'}`}>
                    {step.description}
                  </div>

                  {isCurrent && updatedAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      Cập nhật: {new Date(updatedAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Estimated Delivery (only for PROCESSING and SHIPPING) */}
      {(currentStatus === 'PROCESSING' || currentStatus === 'SHIPPING') && createdAt && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Dự kiến giao hàng:</span>
            <span className="font-semibold text-gray-900">
              {new Date(new Date(createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
