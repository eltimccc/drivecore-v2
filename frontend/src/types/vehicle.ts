// Типы для автомобилей
export interface Vehicle {
  id: string
  plate_number: string
  vin?: string
  brand: string
  model: string
  year: number
  color?: string
  status: VehicleStatus
  mileage_km: number
  city?: VehicleCity
  owner_name?: string
  osago_policy_number?: string
  created_at: string
  updated_at: string
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED_TAXI = 'RENTED_TAXI',
  RENTED_TOUR = 'RENTED_TOUR',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  INACTIVE = 'INACTIVE'
}

export enum VehicleCity {
  PSKOV = 'Псков',
  PECHORY = 'Печоры',
  SEBEZH = 'Себеж',
  OSTROV = 'Остров',
  OPOCHKA = 'Опочка'
}

export interface VehicleCreate {
  plate_number: string
  vin?: string
  brand: string
  model: string
  year: number
  color?: string
  status?: VehicleStatus
  mileage_km?: number
  city?: VehicleCity
  owner_name?: string
  osago_policy_number?: string
}

export interface VehicleUpdate {
  plate_number?: string
  vin?: string
  brand?: string
  model?: string
  year?: number
  color?: string
  status?: VehicleStatus
  mileage_km?: number
  city?: VehicleCity
  owner_name?: string
  osago_policy_number?: string
}

export interface VehicleListResponse {
  items: Vehicle[]
  page: number
  page_size: number
  total: number
}

export interface VehicleFilters {
  q?: string
  status?: VehicleStatus
  city?: VehicleCity
  page?: number
  page_size?: number
  ordering?: string
}

// Статусы для отображения
export const VehicleStatusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.AVAILABLE]: 'Доступен',
  [VehicleStatus.RENTED_TAXI]: 'Арендован (такси)',
  [VehicleStatus.RENTED_TOUR]: 'Арендован (тур)',
  [VehicleStatus.MAINTENANCE]: 'На ТО',
  [VehicleStatus.INSPECTION]: 'На осмотре',
  [VehicleStatus.INACTIVE]: 'Неактивен'
}

// Цвета для статусов
export const VehicleStatusColors: Record<VehicleStatus, string> = {
  [VehicleStatus.AVAILABLE]: 'bg-green-100 text-green-800',
  [VehicleStatus.RENTED_TAXI]: 'bg-blue-100 text-blue-800',
  [VehicleStatus.RENTED_TOUR]: 'bg-purple-100 text-purple-800',
  [VehicleStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
  [VehicleStatus.INSPECTION]: 'bg-orange-100 text-orange-800',
  [VehicleStatus.INACTIVE]: 'bg-gray-100 text-gray-800'
}
