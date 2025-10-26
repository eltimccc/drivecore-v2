import { useState } from 'react'
import { X } from 'lucide-react'
import { VehicleCreate, VehicleStatus, VehicleCity } from '../types/vehicle'
import { useCreateVehicle } from '../hooks/useVehicles'

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VehicleModal({ isOpen, onClose }: VehicleModalProps) {
  const [formData, setFormData] = useState<VehicleCreate>({
    plate_number: '',
    vin: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    status: VehicleStatus.AVAILABLE,
    mileage_km: 0,
    city: undefined,
    owner_name: '',
    osago_policy_number: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const createVehicleMutation = useCreateVehicle()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      await createVehicleMutation.mutateAsync(formData)
      onClose()
      // Сбрасываем форму
      setFormData({
        plate_number: '',
        vin: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        status: VehicleStatus.AVAILABLE,
        mileage_km: 0,
        city: undefined,
        owner_name: '',
        osago_policy_number: '',
      })
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setErrors({ general: error.response.data.detail })
      } else {
        setErrors({ general: 'Произошла ошибка при создании автомобиля' })
      }
    }
  }

  const handleChange = (field: keyof VehicleCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Добавить автомобиль
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Номер */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Государственный номер *
                </label>
                <input
                  type="text"
                  value={formData.plate_number}
                  onChange={(e) => handleChange('plate_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="А111АА77"
                  required
                />
                {errors.plate_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.plate_number}</p>
                )}
              </div>

              {/* VIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN номер
                </label>
                <input
                  type="text"
                  value={formData.vin || ''}
                  onChange={(e) => handleChange('vin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="17 символов"
                  maxLength={17}
                />
              </div>

              {/* Марка */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Марка *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Модель */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Модель *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Год */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Год выпуска *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              {/* Цвет */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цвет
                </label>
                <input
                  type="text"
                  value={formData.color || ''}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as VehicleStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(VehicleStatus).map(([key, value]) => (
                    <option key={key} value={value}>
                      {getStatusLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Пробег */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пробег (км)
                </label>
                <input
                  type="number"
                  value={formData.mileage_km || 0}
                  onChange={(e) => handleChange('mileage_km', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Город */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Город
                </label>
                <select
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите город</option>
                  {Object.values(VehicleCity).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Владелец */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Владелец
                </label>
                <input
                  type="text"
                  value={formData.owner_name || ''}
                  onChange={(e) => handleChange('owner_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ОСАГО */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер ОСАГО
                </label>
                <input
                  type="text"
                  value={formData.osago_policy_number || ''}
                  onChange={(e) => handleChange('osago_policy_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={createVehicleMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createVehicleMutation.isPending ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      </div>
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
