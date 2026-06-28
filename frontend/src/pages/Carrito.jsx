import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../utils/formato'

export default function Carrito() {
  const { items, quitarItem, actualizarCantidad, total } = useCarrito()

  function handleDecrementar(item) {
    if (item.cantidad <= 1) return
    actualizarCantidad(item._id, item.talla, item.cantidad - 1)
  }

  function handleIncrementar(item) {
    actualizarCantidad(item._id, item.talla, item.cantidad + 1)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-crema">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="text-gris2 mx-auto mb-6"
        >
          <path d="M6 6h15l-1.5 9h-12z" />
          <path d="M6 6 5 2H2" />
          <circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none" />
        </svg>
        <h1 className="text-2xl font-bold text-crema mb-2">Tu carrito está vacío</h1>
        <p className="text-gris text-sm mb-8">
          Todavía no agregaste ningún producto. Explorá el catálogo y encontrá tu estilo.
        </p>
        <Link
          to="/catalogo"
          className="inline-block bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-dorado mb-8">Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item._id}-${item.talla}`}
              className="bg-carta border border-borde rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imagen || 'https://via.placeholder.com/100x133?text=URBX'}
                  alt={item.nombre}
                  className="w-20 h-28 object-cover rounded shrink-0"
                />
                <div className="flex-1 text-crema min-w-0">
                  <h3 className="font-medium capitalize truncate">{item.nombre}</h3>
                  <p className="text-sm opacity-70">Talla: {item.talla}</p>
                  <p className="text-dorado font-bold">{formatearPrecio(item.precio)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleDecrementar(item)}
                    disabled={item.cantidad <= 1}
                    className="w-8 h-8 flex items-center justify-center border border-borde text-crema hover:border-dorado hover:text-dorado transition-colors disabled:opacity-40 disabled:hover:border-borde disabled:hover:text-crema disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-crema">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => handleIncrementar(item)}
                    className="w-8 h-8 flex items-center justify-center border border-borde text-crema hover:border-dorado hover:text-dorado transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => quitarItem(item._id, item.talla)}
                  className="text-red-400 hover:text-red-300 text-sm shrink-0"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/catalogo"
            className="inline-block border border-dorado text-dorado font-bold px-6 py-3 rounded hover:bg-dorado hover:text-oscuro transition-colors"
          >
            Seguir comprando
          </Link>
        </div>

        <div className="bg-carta border border-borde rounded-lg p-6 h-fit">
          <h2 className="text-crema font-bold mb-4">Resumen del pedido</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-crema opacity-80">
              <span>Subtotal</span>
              <span>{formatearPrecio(total)}</span>
            </div>
            <div className="flex justify-between text-crema opacity-80">
              <span>Envío</span>
              <span>A confirmar</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-borde">
            <span className="text-crema font-medium">Total</span>
            <span className="text-dorado font-bold text-xl">
              {formatearPrecio(total)}
            </span>
          </div>

          <Link
            to="/checkout"
            className="block text-center mt-6 bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
          >
            Ir a pagar
          </Link>
        </div>
      </div>
    </div>
  )
}
