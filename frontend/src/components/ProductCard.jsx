import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import PrecioProducto from './PrecioProducto'

export default function ProductCard({ producto }) {
  const { _id, nombre, imagen, categoria, enPromocion } = producto
  const { agregarItem } = useCarrito()

  function handleAgregar(e) {
    e.preventDefault()
    e.stopPropagation()
    agregarItem(producto, producto.tallas?.[0] || 'única')
  }

  return (
    <Link
      to={`/producto/${_id}`}
      className="bg-carta border border-borde overflow-hidden hover:border-dorado hover:scale-[1.02] transition-all duration-300 group block"
    >
      <div className="relative aspect-[3/4] bg-oscuro overflow-hidden">
        {enPromocion && (
          <span className="absolute top-3 left-3 bg-dorado text-oscuro text-[10px] font-bold tracking-[0.15em] px-2.5 py-1 z-10">
            PROMO
          </span>
        )}
        <img
          src={imagen || 'https://via.placeholder.com/400x533?text=URBX'}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        {categoria && (
          <p className="text-[10px] tracking-[0.2em] text-gris2 mb-1 uppercase">
            {categoria}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-crema text-sm font-medium">{nombre}</h3>
            <PrecioProducto producto={producto} className="mt-1" />
          </div>
          <button
            type="button"
            onClick={handleAgregar}
            aria-label="Agregar al carrito"
            className="border border-borde text-crema p-2 hover:border-dorado hover:text-dorado transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 2H2" />
              <circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
