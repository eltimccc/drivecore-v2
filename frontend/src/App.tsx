import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Fleet from './pages/Fleet'
import Contracts from './pages/Contracts'
import Finance from './pages/Finance'
import Risk from './pages/Risk'
import Penalties from './pages/Penalties'
import Maintenance from './pages/Maintenance'
import Warehouse from './pages/Warehouse'
import Counterparties from './pages/Counterparties'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fleet" element={<Fleet />} />
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
  )
}

export default App
