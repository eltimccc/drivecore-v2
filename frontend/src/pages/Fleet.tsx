import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleFilters } from '../types/vehicle'
import VehicleFiltersComponent from '../components/VehicleFilters'
import VehicleTable from '../components/VehicleTable'
import VehicleModal from '../components/VehicleModal'
import Pagination from '../components/Pagination'

export default function Fleet() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<VehicleFilters>({
    page: 1,
    page_size: 10,
    ordering: '-created_at'
  })

  const { data, isLoading, error } = useVehicles(filters)

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters(prev => ({ ...prev, page_size: pageSize, page: 1 }))
  }

  const handleVehicleClick = (vehicle: any) => {
    navigate(`/fleet/${vehicle.id}`)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Автопарк</h1>
          <p className="mt-2 text-gray-600">
            Управление транспортными средствами
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить автомобиль
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Произошла ошибка при загрузке данных: {error.message}
        </div>
      )}

      {/* Filters */}
      <VehicleFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Table */}
      <VehicleTable
        vehicles={data?.items || []}
        isLoading={isLoading}
        onVehicleClick={handleVehicleClick}
      />

      {/* Pagination */}
      {data && data.total > 0 && (
        <Pagination
          currentPage={data.page}
          totalPages={Math.ceil(data.total / data.page_size)}
          totalItems={data.total}
          pageSize={data.page_size}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Modal */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}
