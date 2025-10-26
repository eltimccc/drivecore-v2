import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useVehicle, useDeleteVehicle } from '../hooks/useVehicles'
import { VehicleStatusLabels, VehicleStatusColors } from '../types/vehicle'

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: vehicle, isLoading, error } = useVehicle(id!)
  const deleteVehicleMutation = useDeleteVehicle()

  const handleDelete = async () => {
    if (!vehicle) return
    
    if (window.confirm(`Вы уверены, что хотите удалить автомобиль ${vehicle.plate_number}?`)) {
      try {
        await deleteVehicleMutation.mutateAsync(vehicle.id)
        navigate('/fleet')
      } catch (error) {
        console.error('Ошибка при удалении автомобиля:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Автомобиль не найден или произошла ошибка при загрузке
        </div>
        <button
          onClick={() => navigate('/fleet')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Вернуться к списку
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/fleet')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-gray-600">
              {vehicle.plate_number}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/fleet/${vehicle.id}/edit`)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteVehicleMutation.isPending}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteVehicleMutation.isPending ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Информация об автомобиле
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Основная информация
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Государственный номер
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono">
                  {vehicle.plate_number}
                </p>
              </div>
              
              {vehicle.vin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    VIN номер
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {vehicle.vin}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Марка и модель
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {vehicle.brand} {vehicle.model}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Год выпуска
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {vehicle.year}
                </p>
              </div>
              
              {vehicle.color && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Цвет
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {vehicle.color}
                  </p>
                </div>
              )}
            </div>

            {/* Status & Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Статус и местоположение
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Статус
                </label>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${VehicleStatusColors[vehicle.status]}`}>
                    {VehicleStatusLabels[vehicle.status]}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Пробег
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {vehicle.mileage_km.toLocaleString()} км
                </p>
              </div>
              
              {vehicle.city && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Город
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {vehicle.city}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Дополнительная информация
              </h3>
              
              {vehicle.owner_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Владелец
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {vehicle.owner_name}
                  </p>
                </div>
              )}
              
              {vehicle.osago_policy_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Номер ОСАГО
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {vehicle.osago_policy_number}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Дата создания
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(vehicle.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Последнее обновление
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(vehicle.updated_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
