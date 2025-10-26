export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="mt-2 text-gray-600">
          Настройки системы и пользователей
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Настройки
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Здесь будут настройки системы, пользователей, 
            интеграций и конфигурация приложения.
          </p>
        </div>
      </div>
    </div>
  )
}
