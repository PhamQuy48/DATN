'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

type OrderStatusChartProps = {
  data: {
    status: string
    count: number
  }[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  PROCESSING: '#3b82f6',
  SHIPPING: '#8b5cf6',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDING: '#f97316'
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDING: 'Hoàn tiền'
}

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    label: STATUS_LABELS[item.status] || item.status,
    color: STATUS_COLORS[item.status] || '#6b7280'
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Đơn hàng theo trạng thái</h3>
        <p className="text-sm text-gray-600">Phân bố trạng thái đơn hàng</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number | undefined) => [value ?? 0, 'Số đơn']}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
