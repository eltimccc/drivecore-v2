import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Fleet from './pages/Fleet'
import VehicleDetails from './pages/VehicleDetails'
import Contracts from './pages/Contracts'
import Finance from './pages/Finance'
import Risk from './pages/Risk'
import Penalties from './pages/Penalties'
import Maintenance from './pages/Maintenance'
import Warehouse from './pages/Warehouse'
import Counterparties from './pages/Counterparties'
import Settings from './pages/Settings'

// Создаем клиент React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/fleet/:id" element={<VehicleDetails />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/penalties" element={<Penalties />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/counterparties" element={<Counterparties />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  )
}

export default App
