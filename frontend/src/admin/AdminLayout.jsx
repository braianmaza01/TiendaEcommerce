import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AuthContext'

const enlaces = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/productos', label: 'Productos', end: false },
  { to: '/admin/pedidos', label: 'Pedidos', end: false },
]

function claseEnlace(isActive) {
  return `block px-6 py-4 text-sm tracking-wide transition-colors border-l-2 ${
    isActive
      ? 'bg-oscuro text-dorado border-dorado'
      : 'text-gris border-transparent hover:text-crema'
  }`
}

export default function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-oscuro flex">
      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-full md:w-64 bg-carta border-r border-borde flex flex-col shrink-0 transform transition-transform duration-200 ${
          menuAbierto ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-borde flex items-center justify-between">
          <div>
            <p className="text-xl font-bold tracking-[0.3em] text-crema">URBX</p>
            <p className="text-[10px] tracking-[0.2em] text-gris2 mt-1">
              ADMIN PANEL
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMenuAbierto(false)}
            aria-label="Cerrar menú"
            className="md:hidden text-gris hover:text-crema p-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-6">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.end}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) => claseEnlace(isActive)}
            >
              {enlace.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-borde">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gris hover:text-dorado transition-colors py-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Ver tienda
          </a>

          <div className="border-t border-borde my-3" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left text-sm text-gris hover:text-dorado transition-colors py-2"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between bg-carta border-b border-borde px-4 py-4 sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            className="text-crema p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <p className="text-sm font-bold tracking-[0.3em] text-crema">URBX</p>
          <span className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
