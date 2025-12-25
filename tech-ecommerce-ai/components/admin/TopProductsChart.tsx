'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'

type TopProductsChartProps = {
  data: {
    name: string
    sold: number
    revenue: number
  }[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Top 5 sản phẩm bán chạy</h3>
        <p className="text-sm text-gray-600">Theo số lượng đã bán</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="sold"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined, name: string | undefined, props: any) => {
              if (name === 'sold') {
                return [value ?? 0, 'Đã bán']
              }
              return [value ?? 0, name ?? '']
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              const item = data[entry.payload?.index]
              return item ? `${item.name}: ${item.sold} sản phẩm` : value
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
