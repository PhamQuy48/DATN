import { LucideIcon } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'

type StatCardProps = {
  title: string
  value: number | string
  icon: LucideIcon
  gradient: string
  isCurrency?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  isCurrency = false,
  trend
}: StatCardProps) {
  const displayValue = isCurrency && typeof value === 'number'
    ? formatPrice(value)
    : value.toLocaleString('vi-VN')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
      </div>
    </div>
  )
}
