import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCarrito } from '../context/CarritoContext'
import PrecioProducto from '../components/PrecioProducto'
import ProductCard from '../components/ProductCard'
import { API_URL } from '../utils/api'

export default function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarItem } = useCarrito()

  const [producto, setProducto] = useState(null)
  const [talla, setTalla] = useState('')
  const [mostrarErrorTalla, setMostrarErrorTalla] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [relacionados, setRelacionados] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/api/productos/${id}`)
      .then((res) => setProducto(res.data))
      .catch(() => setError('No se pudo cargar el producto.'))
      .finally(() => setCargando(false))
  }, [id])

  useEffect(() => {
    if (!producto) return
    axios
      .get(`${API_URL}/api/productos`)
      .then((res) => {
        const filtrados = res.data.filter(
          (p) => p._id !== producto._id && p.categoria === producto.categoria
        )
        setRelacionados(filtrados.slice(0, 4))
      })
      .catch(() => setRelacionados([]))
  }, [producto])

  function handleSeleccionarTalla(t) {
    setTalla(t)
    setMostrarErrorTalla(false)
  }

  function handleAgregar() {
    if (!producto) return
    if (producto.tallas?.length > 0 && !talla) {
      setMostrarErrorTalla(true)
      return
    }
    agregarItem(producto, talla || 'única')
    navigate('/carrito')
  }

  if (cargando) return <p className="text-crema text-center py-12">Cargando...</p>
  if (error) return <p className="text-red-400 text-center py-12">{error}</p>
  if (!producto) return null

  return (
    <div>
      <nav className="max-w-6xl mx-auto px-6 md:px-10 pt-4 text-xs text-gris2 flex items-center gap-2">
        <Link to="/" className="hover:text-dorado transition-colors">
          Inicio
        </Link>
        <span>›</span>
        <Link to="/catalogo" className="hover:text-dorado transition-colors">
          Catálogo
        </Link>
        <span>›</span>
        <span className="text-gris truncate capitalize">{producto.nombre}</span>
      </nav>

      <div className="max-w-6xl mx-auto px-0 md:px-10 pt-4 pb-10 md:pb-12 grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="relative w-full h-[350px] md:h-[450px] bg-carta overflow-hidden md:rounded-lg">
          {producto.enPromocion && (
            <span className="absolute top-3 left-3 bg-dorado text-oscuro text-[10px] font-bold tracking-[0.15em] px-2.5 py-1 z-10">
              PROMO
            </span>
          )}
          <img
            src={producto.imagen || 'https://via.placeholder.com/600x800?text=URBX'}
            alt={producto.nombre}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-crema px-6 md:px-0">
          <div className="flex items-center gap-2 mb-3">
            {producto.categoria && (
              <span className="text-[10px] tracking-[0.15em] text-gris2 uppercase border border-borde px-2 py-1">
                {producto.categoria}
              </span>
            )}
            {producto.genero && (
              <span className="text-[10px] tracking-[0.15em] text-gris2 uppercase border border-borde px-2 py-1">
                {producto.genero}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2 capitalize">{producto.nombre}</h1>
          <PrecioProducto producto={producto} className="text-2xl mb-4" />

          {producto.descripcion && (
            <p className="opacity-80 mb-6">{producto.descripcion}</p>
          )}

          {producto.tallas?.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 font-medium">Talla</p>
              <div className="flex flex-wrap gap-2">
                {producto.tallas.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSeleccionarTalla(t)}
                    className={`px-4 py-2 border rounded ${
                      talla === t
                        ? 'border-dorado text-dorado'
                        : 'border-borde text-crema'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {mostrarErrorTalla && (
                <p className="text-red-400 text-sm mt-2">Seleccioná un talle</p>
              )}
            </div>
          )}

          <button
            onClick={handleAgregar}
            className="bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
          >
            Agregar al carrito
          </button>

          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-borde text-sm text-gris">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 9 5 4h14l2 5" />
                <path d="M4 9v10h16V9" />
                <path d="M9 19v-5h6v5" />
              </svg>
              <span>Retiro en local</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1" y="7" width="13" height="9" rx="1" />
                <path d="M14 10h4l3 3v3h-7z" />
                <circle cx="6" cy="18" r="1.6" />
                <circle cx="17" cy="18" r="1.6" />
              </svg>
              <span>Envío a domicilio</span>
            </div>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-16">
          <h2 className="text-sm tracking-[0.25em] text-gris mb-8">
            PRODUCTOS RELACIONADOS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relacionados.map((p) => (
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
