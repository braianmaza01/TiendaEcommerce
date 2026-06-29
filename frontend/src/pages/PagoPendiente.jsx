import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function PagoPendiente() {
  const [searchParams] = useSearchParams()
  const { vaciarCarrito } = useCarrito()
  const numeroPedido = searchParams.get('external_reference')

  useEffect(() => {
    vaciarCarrito()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center text-crema">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#facc15"
        strokeWidth="1.6"
        className="mx-auto mb-6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v5l3.5 3.5" />
      </svg>

      <h1 className="text-2xl font-bold mb-2">Pago pendiente</h1>

      {numeroPedido && (
        <p className="text-gris text-sm mb-1">
          Tu número de pedido es{' '}
          <span className="text-dorado font-bold">
            #{numeroPedido.slice(-6).toUpperCase()}
          </span>
        </p>
      )}

      <p className="text-gris text-sm mb-8">
        Tu pago está siendo procesado por Mercado Pago. Esto puede tardar
        unos minutos, por ejemplo si elegiste pago en efectivo o transferencia
        bancaria. Te avisaremos por email apenas se confirme.
      </p>

      <Link
        to="/"
        className="inline-block bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}
