import { Link } from 'react-router-dom'

export default function PagoFallido() {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center text-crema">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f87171"
        strokeWidth="1.6"
        className="mx-auto mb-6"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>

      <h1 className="text-2xl font-bold mb-2">El pago no pudo procesarse</h1>
      <p className="text-gris text-sm mb-8">
        Ocurrió un problema al procesar tu pago con Mercado Pago. No se
        realizó ningún cobro. Podés intentarlo nuevamente o elegir otro
        método de pago.
      </p>

      <Link
        to="/checkout"
        className="inline-block bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
      >
        Reintentar
      </Link>
    </div>
  )
}
