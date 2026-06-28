import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000
const GENEROS_VALIDOS = ['hombre', 'mujer']

const FILTROS = [
  { label: 'TODOS', valor: 'todos' },
  { label: 'HOMBRE', valor: 'hombre' },
  { label: 'MUJER', valor: 'mujer' },
  { label: 'NUEVO', valor: 'nuevo' },
  { label: 'PROMOCIONES', valor: 'promociones' },
]

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const categoriaParam = (searchParams.get('categoria') || '').toLowerCase()
  const filtroParam = (searchParams.get('filtro') || '').toLowerCase()

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/productos')
      .then((res) => setProductos(res.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false))
  }, [])

  function handleFiltroClick(valor) {
    if (valor === 'todos') {
      setSearchParams({})
    } else if (valor === 'nuevo') {
      setSearchParams({ filtro: 'nuevo' })
    } else {
      setSearchParams({ categoria: valor })
    }
  }

  const filtroActivo = filtroParam === 'nuevo' ? 'nuevo' : categoriaParam || 'todos'

  const productosFiltrados = productos.filter((p) => {
    if (filtroParam === 'nuevo') {
      return Date.now() - new Date(p.createdAt).getTime() <= TREINTA_DIAS_MS
    }
    if (!categoriaParam) return true
    if (categoriaParam === 'promociones') return Boolean(p.enPromocion)
    if (GENEROS_VALIDOS.includes(categoriaParam)) {
      return (p.genero || '').toLowerCase() === categoriaParam
    }
    return (p.categoria || '').toLowerCase() === categoriaParam
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-dorado mb-8">Catálogo</h1>

      <div className="flex flex-wrap gap-6 mb-10 border-b border-borde pb-5">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => handleFiltroClick(f.valor)}
            className={`text-xs tracking-[0.15em] transition-colors ${
              filtroActivo === f.valor
                ? 'text-dorado'
                : 'text-gris hover:text-crema'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {cargando && <p className="text-crema">Cargando productos...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <p className="text-crema opacity-70">No hay productos en esta categoría.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <ProductCard key={producto._id} producto={producto} />
        ))}
      </div>
    </div>
  )
}
