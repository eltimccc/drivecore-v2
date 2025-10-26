import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  Wrench, 
  Package, 
  Users, 
  Settings 
} from 'lucide-react'

const menuItems = [
  { path: '/', label: 'Дашборд', icon: LayoutDashboard },
  { path: '/fleet', label: 'Автопарк', icon: Car },
  { path: '/contracts', label: 'Договоры', icon: FileText },
  { path: '/finance', label: 'Финансы', icon: DollarSign },
  { path: '/risk', label: 'Риски', icon: Shield },
  { path: '/penalties', label: 'Штрафы', icon: AlertTriangle },
  { path: '/maintenance', label: 'ТО и ремонты', icon: Wrench },
  { path: '/warehouse', label: 'Склад', icon: Package },
  { path: '/counterparties', label: 'Контрагенты', icon: Users },
  { path: '/settings', label: 'Настройки', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : 'text-gray-600'}`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
