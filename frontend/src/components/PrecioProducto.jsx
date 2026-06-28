import { formatearPrecio } from '../utils/formato'

export default function PrecioProducto({ producto, className = '' }) {
  const { precio, precioAnterior, enPromocion } = producto
  const enOferta = enPromocion && precioAnterior

  if (!enOferta) {
    return (
      <p className={`text-dorado font-bold ${className}`}>
        {formatearPrecio(precio)}
      </p>
    )
  }

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-[#555] text-sm line-through">
        {formatearPrecio(precioAnterior)}
      </span>
      <span className="text-dorado font-bold">{formatearPrecio(precio)}</span>
    </div>
  )
}
