import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'

const valores = [
  {
    titulo: 'Calidad',
    descripcion: 'Seleccionamos materiales premium y cuidamos cada detalle de producción.',
    icono: (
      <>
        <path d="M12 3 3 8l9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
      </>
    ),
  },
  {
    titulo: 'Identidad',
    descripcion: 'Cada prenda está pensada para que expreses tu propio estilo, sin moldes.',
    icono: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </>
    ),
  },
  {
    titulo: 'Comunidad',
    descripcion: 'Crecemos junto a quienes eligen URBX para marcar tendencia en la calle.',
    icono: (
      <>
        <circle cx="8.5" cy="8.5" r="3" />
        <circle cx="16" cy="9.5" r="2.4" />
        <path d="M3 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
        <path d="M14 16.2c2.4.3 4 2 4 3.8" />
      </>
    ),
  },
]

export default function SobreNosotros() {
  return (
    <div>
      <section className="bg-carta border-b border-borde">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <FadeIn>
            <p className="text-[11px] tracking-[0.25em] text-gris mb-5">URBX</p>
            <h1 className="text-4xl md:text-5xl font-bold text-crema mb-6">
              Quiénes Somos
            </h1>
            <p className="text-gris text-base max-w-2xl mx-auto">
              URBX nació en 2023 de la necesidad de vestir la calle con identidad
              propia. Nos inspira la cultura urbana, el streetwear que no sigue
              reglas y la gente que elige marcar tendencia en lugar de seguirla.
              Nuestra visión es simple: ropa premium, cortes modernos y una marca
              que crece junto a su comunidad.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-oscuro">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <FadeIn>
            <h2 className="text-sm tracking-[0.25em] text-gris text-center mb-12">
              NUESTROS VALORES
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {valores.map((valor, i) => (
              <FadeIn key={valor.titulo} delay={i * 0.1}>
                <div className="bg-carta border border-borde rounded-lg p-8 text-center h-full">
                  <div className="w-14 h-14 rounded-full border border-dorado flex items-center justify-center mx-auto mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.6">
                      {valor.icono}
                    </svg>
                  </div>
                  <p className="text-crema font-bold mb-2">{valor.titulo}</p>
                  <p className="text-gris text-sm">{valor.descripcion}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-carta border-t border-borde">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-crema mb-4">
              Sumate al movimiento URBX
            </h2>
            <p className="text-gris text-sm mb-8 max-w-md mx-auto">
              Descubrí la colección y encontrá las prendas que van con tu
              estilo.
            </p>
            <Link
              to="/catalogo"
              className="inline-block bg-dorado text-oscuro text-sm font-bold tracking-[0.15em] px-8 py-4 hover:opacity-90 transition-opacity"
            >
              VER COLECCIÓN
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
