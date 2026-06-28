import FadeIn from '../components/FadeIn'

const pasos = [
  {
    titulo: 'Elegí tu producto',
    descripcion: 'Explorá el catálogo y encontrá la prenda que va con tu estilo.',
    icono: (
      <path d="M8 4 4 8v4h3v8h10v-8h3V8l-4-4M8 4a4 4 0 0 0 8 0" />
    ),
  },
  {
    titulo: 'Seleccioná tu talle',
    descripcion: 'Elegí el talle disponible antes de agregarlo al carrito.',
    icono: (
      <>
        <path d="M3 12 12 3h6a3 3 0 0 1 3 3v6l-9 9z" />
        <circle cx="16" cy="8" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    titulo: 'Completá tus datos',
    descripcion: 'Indicá tus datos de contacto y elegí retiro o envío a domicilio.',
    icono: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1.5" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    titulo: 'Recibí tu pedido',
    descripcion: 'Te contactamos por WhatsApp para coordinar la entrega final.',
    icono: (
      <>
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </>
    ),
  },
]

export default function ComoComprar() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="text-3xl font-bold text-dorado mb-3 text-center">Cómo comprar</h1>
        <p className="text-gris text-center max-w-xl mx-auto mb-16">
          Comprar en URBX es simple y rápido. Seguí estos 4 pasos y tu pedido
          está en camino.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {pasos.map((paso, i) => (
          <FadeIn key={paso.titulo} delay={i * 0.1}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border border-dorado flex items-center justify-center mx-auto mb-5">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.6">
                  {paso.icono}
                </svg>
              </div>
              <p className="text-crema font-bold mb-2">
                {i + 1}. {paso.titulo}
              </p>
              <p className="text-gris text-sm">{paso.descripcion}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
