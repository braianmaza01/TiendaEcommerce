import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../utils/formato'
import { API_URL } from '../utils/api'

const enlacesPrincipales = [
  { label: 'NUEVA COLECCIÓN', to: '/catalogo?filtro=nuevo' },
  { label: 'HOMBRE', to: '/catalogo?categoria=hombre' },
  { label: 'MUJER', to: '/catalogo?categoria=mujer' },
]

const categorias = [
  { label: 'REMERAS', to: '/catalogo?categoria=remeras' },
  { label: 'BUZOS', to: '/catalogo?categoria=buzos' },
  { label: 'PANTALONES', to: '/catalogo?categoria=pantalones' },
  { label: 'ACCESORIOS', to: '/catalogo?categoria=accesorios' },
  { label: 'CAMPERAS', to: '/catalogo?categoria=camperas' },
]

export default function Navbar() {
  const { cantidadTotal } = useCarrito()
  const navigate = useNavigate()
  const navRef = useRef(null)

  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [usuarioAbierto, setUsuarioAbierto] = useState(false)

  const tieneSesionAdmin = Boolean(localStorage.getItem('urbx_admin_token'))

  function toggleMenu() {
    setMenuAbierto((abierto) => !abierto)
    setBusquedaAbierta(false)
    setUsuarioAbierto(false)
  }

  function cerrarBusqueda() {
    setBusquedaAbierta(false)
    setQuery('')
    setResultados([])
  }

  function toggleBusqueda() {
    if (busquedaAbierta) {
      cerrarBusqueda()
    } else {
      setBusquedaAbierta(true)
      setMenuAbierto(false)
      setUsuarioAbierto(false)
    }
  }

  function handleClickUsuario() {
    if (!tieneSesionAdmin) {
      navigate('/admin/login')
      return
    }
    setUsuarioAbierto((abierto) => !abierto)
    setMenuAbierto(false)
    setBusquedaAbierta(false)
  }

  function handleCerrarSesion() {
    localStorage.removeItem('urbx_admin_token')
    window.location.reload()
  }

  useEffect(() => {
    if (!query.trim()) {
      setResultados([])
      setBuscando(false)
      return
    }

    setBuscando(true)
    const timeout = setTimeout(() => {
      axios
        .get(`${API_URL}/api/productos?nombre=${encodeURIComponent(query)}`)
        .then((res) => setResultados(res.data))
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    if (!busquedaAbierta) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') cerrarBusqueda()
    }
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        cerrarBusqueda()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [busquedaAbierta])

  useEffect(() => {
    if (!usuarioAbierto) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') setUsuarioAbierto(false)
    }
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setUsuarioAbierto(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [usuarioAbierto])

  return (
    <nav ref={navRef} className="bg-oscuro border-b border-borde sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden text-crema hover:text-dorado transition-colors"
          >
            {menuAbierto ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          <Link
            to="/"
            className="text-xl font-bold tracking-[0.3em] text-crema shrink-0"
          >
            URBX
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {enlacesPrincipales.map((enlace) => (
            <Link
              key={enlace.label}
              to={enlace.to}
              className="relative text-[11px] font-medium tracking-[0.2em] text-gris hover:text-dorado transition-colors group"
            >
              {enlace.label}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-px w-0 bg-dorado transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          <div className="relative group">
            <button
              type="button"
              className="relative flex items-center gap-1 text-[11px] font-medium tracking-[0.2em] text-gris hover:text-dorado transition-colors"
            >
              CATEGORÍAS
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-px w-0 bg-dorado transition-all duration-300 group-hover:w-full" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-full w-max pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
              <div className="bg-carta border border-borde py-2 min-w-[170px]">
                {categorias.map((cat) => (
                  <Link
                    key={cat.label}
                    to={cat.to}
                    className="block px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] text-gris hover:text-dorado hover:bg-oscuro transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <button
            type="button"
            onClick={toggleBusqueda}
            aria-label="Buscar"
            className="text-crema hover:text-dorado transition-colors"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link
            to="/carrito"
            aria-label="Carrito"
            className="relative text-crema hover:text-dorado transition-colors"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 2H2" />
              <circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none" />
            </svg>
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-dorado text-oscuro text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={handleClickUsuario}
              aria-label="Usuario"
              className="text-crema hover:text-dorado transition-colors"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {tieneSesionAdmin && usuarioAbierto && (
              <div className="absolute right-0 top-full mt-3 bg-carta border border-borde min-w-[170px] py-2 z-50">
                <Link
                  to="/admin"
                  onClick={() => setUsuarioAbierto(false)}
                  className="block px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] text-gris hover:text-dorado hover:bg-oscuro transition-colors"
                >
                  PANEL ADMIN
                </Link>
                <button
                  type="button"
                  onClick={handleCerrarSesion}
                  className="w-full text-left block px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] text-gris hover:text-dorado hover:bg-oscuro transition-colors"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuAbierto ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col px-6 pb-4 border-t border-borde">
          {enlacesPrincipales.map((enlace) => (
            <Link
              key={enlace.label}
              to={enlace.to}
              onClick={() => setMenuAbierto(false)}
              className="text-sm font-medium tracking-[0.2em] text-gris hover:text-dorado py-3 transition-colors"
            >
              {enlace.label}
            </Link>
          ))}

          <div className="border-t border-borde my-2" />

          {categorias.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              onClick={() => setMenuAbierto(false)}
              className="text-sm font-medium tracking-[0.2em] text-gris hover:text-dorado py-3 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          busquedaAbierta ? 'max-h-[32rem]' : 'max-h-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 border-t border-borde">
          <input
            type="text"
            autoFocus={busquedaAbierta}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full bg-carta border border-borde px-4 py-3 text-crema placeholder-gris2 focus:border-dorado outline-none transition-colors"
          />

          {buscando && <p className="text-gris text-sm mt-3">Buscando...</p>}

          {!buscando && query.trim() && resultados.length === 0 && (
            <p className="text-gris2 text-sm mt-3">No se encontraron productos.</p>
          )}

          {resultados.length > 0 && (
            <div className="mt-4 space-y-1 max-h-80 overflow-y-auto">
              {resultados.map((p) => (
                <Link
                  key={p._id}
                  to={`/producto/${p._id}`}
                  onClick={cerrarBusqueda}
                  className="flex items-center gap-3 p-2 hover:bg-carta transition-colors"
                >
                  <img
                    src={p.imagen || 'https://via.placeholder.com/100x133?text=URBX'}
                    alt={p.nombre}
                    className="w-12 h-16 object-cover bg-carta shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-crema text-sm truncate">{p.nombre}</p>
                    <p className="text-dorado text-sm font-bold">
                      {formatearPrecio(p.precio)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
