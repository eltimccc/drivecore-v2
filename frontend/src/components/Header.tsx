import { Car } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              DriveCore v2
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Система управления автопарком
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
