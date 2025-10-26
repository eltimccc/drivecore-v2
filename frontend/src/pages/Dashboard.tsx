export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <p className="mt-2 text-gray-600">
          Добро пожаловать в DriveCore v2
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Система управления автопарком
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Здесь будет отображаться основная информация о состоянии автопарка, 
            статистика и ключевые показатели.
          </p>
        </div>
      </div>
    </div>
  )
}
