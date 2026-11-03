interface CountCardProps {
  title: string
  count: number
}

export function CountCard({ title, count }: CountCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
    </div>
  )
}
