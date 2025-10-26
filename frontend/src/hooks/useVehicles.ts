import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../lib/api'
import { Vehicle, VehicleCreate, VehicleUpdate, VehicleListResponse, VehicleFilters } from '../types/vehicle'

// Ключи для кэширования
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.lists(), filters] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
}

// Получение списка автомобилей
export function useVehicles(filters: VehicleFilters) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: async (): Promise<VehicleListResponse> => {
      const params = new URLSearchParams()
      
      if (filters.q) params.append('q', filters.q)
      if (filters.status) params.append('status', filters.status)
      if (filters.city) params.append('city', filters.city)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.page_size) params.append('page_size', filters.page_size.toString())
      if (filters.ordering) params.append('ordering', filters.ordering)
      
      const response = await apiClient.get(`/api/v1/vehicles?${params.toString()}`)
      return response.data
    },
  })
}

// Получение автомобиля по ID
export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: async (): Promise<Vehicle> => {
      const response = await apiClient.get(`/api/v1/vehicles/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Создание автомобиля
export function useCreateVehicle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: VehicleCreate): Promise<Vehicle> => {
      const response = await apiClient.post('/api/v1/vehicles', data)
      return response.data
    },
    onSuccess: () => {
      // Инвалидируем кэш списка автомобилей
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
    },
  })
}

// Обновление автомобиля
export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VehicleUpdate }): Promise<Vehicle> => {
      const response = await apiClient.put(`/api/v1/vehicles/${id}`, data)
      return response.data
    },
    onSuccess: (updatedVehicle) => {
      // Обновляем кэш конкретного автомобиля
      queryClient.setQueryData(vehicleKeys.detail(updatedVehicle.id), updatedVehicle)
      // Инвалидируем кэш списка
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
    },
  })
}

// Удаление автомобиля
export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/v1/vehicles/${id}`)
    },
    onSuccess: (_, id) => {
      // Удаляем из кэша
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(id) })
      // Инвалидируем кэш списка
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
    },
  })
}
