export default function Penalties() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Штрафы</h1>
        <p className="mt-2 text-gray-600">
          Учёт штрафов и нарушений
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Штрафы
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Здесь будет список всех штрафов, их статус, 
            суммы к оплате и история нарушений.
          </p>
        </div>
      </div>
    </div>
  )
}
