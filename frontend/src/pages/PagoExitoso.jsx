import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function PagoExitoso() {
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
        stroke="#4ade80"
        strokeWidth="1.6"
        className="mx-auto mb-6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12.5 11 15.5 16 9" />
      </svg>

      <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>

      {numeroPedido && (
        <p className="text-gris text-sm mb-1">
          Tu número de pedido es{' '}
          <span className="text-dorado font-bold">
            #{numeroPedido.slice(-6).toUpperCase()}
          </span>
        </p>
      )}

      <p className="text-gris text-sm mb-8">
        Tu pago fue aprobado. Te contactaremos a la brevedad para coordinar
        la entrega de tu pedido.
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
