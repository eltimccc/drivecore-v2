import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { VehicleStatus, VehicleCity, VehicleFilters } from '../types/vehicle'

interface VehicleFiltersProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
}

export default function VehicleFiltersComponent({ filters, onFiltersChange }: VehicleFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, q: value || undefined, page: 1 })
  }

  const handleStatusChange = (status: VehicleStatus | '') => {
    onFiltersChange({ 
      ...filters, 
      status: status || undefined, 
      page: 1 
    })
  }

  const handleCityChange = (city: VehicleCity | '') => {
    onFiltersChange({ 
      ...filters, 
      city: city || undefined, 
      page: 1 
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      page_size: filters.page_size || 10,
      ordering: filters.ordering || '-created_at'
    })
  }

  const hasActiveFilters = filters.q || filters.status || filters.city

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру, VIN, марке, модели..."
            value={filters.q || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 border rounded-md ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {[filters.q, filters.status, filters.city].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4 mr-1" />
            Очистить
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleStatusChange(e.target.value as VehicleStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все статусы</option>
                {Object.entries(VehicleStatus).map(([key, value]) => (
                  <option key={key} value={value}>
                    {getStatusLabel(value)}
                  </option>
                ))}
              </select>
            </div>

            {/* City filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Город
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleCityChange(e.target.value as VehicleCity | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все города</option>
                {Object.values(VehicleCity).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Вспомогательная функция для получения метки статуса
function getStatusLabel(status: VehicleStatus): string {
  const labels: Record<VehicleStatus, string> = {
    [VehicleStatus.AVAILABLE]: 'Доступен',
    [VehicleStatus.RENTED_TAXI]: 'Арендован (такси)',
    [VehicleStatus.RENTED_TOUR]: 'Арендован (тур)',
    [VehicleStatus.MAINTENANCE]: 'На ТО',
    [VehicleStatus.INSPECTION]: 'На осмотре',
    [VehicleStatus.INACTIVE]: 'Неактивен'
  }
  return labels[status]
}
